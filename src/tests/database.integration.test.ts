import { inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseServerEnv } from "../lib/env-schema";
import { createDatabaseClient } from "../server/db/connection";
import {
  getApplicantFoundation,
  getMajorsForProgramCode,
  getProgramsForCampusCode,
  getStudentFoundation,
} from "../server/db/queries/foundation";
import {
  campusSeed,
  majorSeed,
  programSeed,
  seedIds,
} from "../server/db/seed/data";
import { seedDatabase } from "../server/db/seed";
import { campuses, people, programMajors, programs } from "../server/db/schema";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
const env = parseServerEnv(process.env);
const { client, database } = createDatabaseClient(env.DATABASE_URL, { max: 1 });

async function expectPostgresError(
  operation: Promise<unknown>,
  expectedCode: string,
) {
  try {
    await operation;
    expect.fail(`Expected PostgreSQL error ${expectedCode}.`);
  } catch (error) {
    expect(error).toMatchObject({ code: expectedCode });
  }
}

describe("P2-M2 database foundation", () => {
  beforeAll(async () => {
    await seedDatabase(database);
  });

  afterAll(async () => {
    await client.end();
  });

  it("connects with the validated server DATABASE_URL", async () => {
    const [result] = await client<
      { connected: number }[]
    >`select 1 as connected`;
    expect(result.connected).toBe(1);
  });

  it("has the complete migrated foundation schema", async () => {
    const expectedTables = [
      "applicant_profiles",
      "campuses",
      "employee_profiles",
      "people",
      "program_majors",
      "programs",
      "student_profiles",
    ];
    const rows = await client<{ table_name: string }[]>`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
      order by table_name
    `;
    const actual = rows.map((row) => row.table_name);

    expect(actual).toEqual(expect.arrayContaining(expectedTables));

    const [migrationCount] = await client<{ count: number }[]>`
      select count(*)::int as count from drizzle.__drizzle_migrations
    `;
    expect(migrationCount.count).toBeGreaterThan(0);
  });

  it("reapplies the deterministic seed without duplicating foundation rows", async () => {
    await seedDatabase(database);
    await seedDatabase(database);

    const seededCampuses = await database
      .select({ id: campuses.id })
      .from(campuses)
      .where(inArray(campuses.id, Object.values(seedIds.campuses)));
    const seededPrograms = await database
      .select({ id: programs.id })
      .from(programs)
      .where(inArray(programs.id, Object.values(seedIds.programs)));
    const seededMajors = await database
      .select({ id: programMajors.id })
      .from(programMajors)
      .where(inArray(programMajors.id, Object.values(seedIds.majors)));
    const seededPeople = await database
      .select({ id: people.id })
      .from(people)
      .where(inArray(people.id, Object.values(seedIds.people)));

    expect(seededCampuses).toHaveLength(campusSeed.length);
    expect(seededPrograms).toHaveLength(programSeed.length);
    expect(seededMajors).toHaveLength(majorSeed.length);
    expect(seededPeople).toHaveLength(Object.keys(seedIds.people).length);
  });

  it("retrieves IIT / CAA programs through the campus relation", async () => {
    const rows = await getProgramsForCampusCode(database, "IIT_CAA");

    expect(rows.map((row) => row.programCode)).toEqual(["BSIS", "CPE"]);
    expect(new Set(rows.map((row) => row.campusCode))).toEqual(
      new Set(["IIT_CAA"]),
    );
  });

  it("retrieves the three BSBA majors through the program relation", async () => {
    const rows = await getMajorsForProgramCode(database, "BSBA");

    expect(rows.map((row) => row.majorName)).toEqual([
      "Financial Management",
      "Human Resource Management",
      "Marketing Management",
    ]);
  });

  it("resolves the fake student through person, program, and campus", async () => {
    const student = await getStudentFoundation(database, "TEST-2027-0001");

    expect(student).toMatchObject({
      firstName: "Alex",
      lastName: "Teststudent",
      programCode: "BSIS",
      campusCode: "IIT_CAA",
    });
  });

  it("resolves the fake applicant through person, program, and campus", async () => {
    const applicant = await getApplicantFoundation(database, "APP-TEST-0001");

    expect(applicant).toMatchObject({
      firstName: "Jamie",
      lastName: "Testapplicant",
      programCode: "CPE",
      campusCode: "IIT_CAA",
    });
  });

  it("rejects a duplicate campus code", async () => {
    const firstId = crypto.randomUUID();
    const duplicateId = crypto.randomUUID();
    const code = `TEST_${firstId.slice(0, 8)}`;

    await client`
      insert into campuses (id, code, name)
      values (${firstId}, ${code}, 'Synthetic constraint test campus')
    `;
    try {
      await expectPostgresError(
        client`
          insert into campuses (id, code, name)
          values (${duplicateId}, ${code}, 'Synthetic duplicate campus')
        `,
        "23505",
      );
    } finally {
      await client`delete from campuses where id = ${firstId}`;
    }
  });

  it("rejects a program that references a nonexistent campus", async () => {
    await expectPostgresError(
      client`
        insert into programs (id, campus_id, code, name, short_name)
        values (
          ${crypto.randomUUID()},
          ${crypto.randomUUID()},
          ${`BAD_${crypto.randomUUID().slice(0, 8)}`},
          'Synthetic invalid program',
          'Invalid'
        )
      `,
      "23503",
    );
  });

  it("rejects a student profile that references a nonexistent person", async () => {
    await expectPostgresError(
      client`
        insert into student_profiles (
          id, person_id, student_number, program_id, student_status
        ) values (
          ${crypto.randomUUID()},
          ${crypto.randomUUID()},
          ${`TEST-NO-PERSON-${crypto.randomUUID().slice(0, 8)}`},
          ${seedIds.programs.bsis},
          'ACTIVE'
        )
      `,
      "23503",
    );
  });

  it("rejects a duplicate non-null student number", async () => {
    const personId = crypto.randomUUID();
    await client`
      insert into people (id, first_name, last_name)
      values (${personId}, 'Synthetic', 'DuplicateStudentNumber')
    `;
    try {
      await expectPostgresError(
        client`
          insert into student_profiles (
            id, person_id, student_number, program_id, student_status
          ) values (
            ${crypto.randomUUID()},
            ${personId},
            'TEST-2027-0001',
            ${seedIds.programs.bsis},
            'ACTIVE'
          )
        `,
        "23505",
      );
    } finally {
      await client`delete from people where id = ${personId}`;
    }
  });

  it("rejects a major that does not belong to the student program", async () => {
    const personId = crypto.randomUUID();
    await client`
      insert into people (id, first_name, last_name)
      values (${personId}, 'Synthetic', 'MismatchedMajor')
    `;
    try {
      await expectPostgresError(
        client`
          insert into student_profiles (
            id, person_id, student_number, program_id, major_id, student_status
          ) values (
            ${crypto.randomUUID()},
            ${personId},
            ${`TEST-MAJOR-${crypto.randomUUID().slice(0, 8)}`},
            ${seedIds.programs.bsis},
            ${seedIds.majors.financialManagement},
            'ACTIVE'
          )
        `,
        "23503",
      );
    } finally {
      await client`delete from people where id = ${personId}`;
    }
  });
});
