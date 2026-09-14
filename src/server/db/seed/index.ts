import type { Database } from "../connection";
import {
  applicantProfiles,
  campuses,
  employeeProfiles,
  people,
  programMajors,
  programs,
  studentProfiles,
} from "../schema";
import { campusSeed, majorSeed, programSeed, seedIds } from "./data";

export async function seedDatabase(database: Database) {
  await database.transaction(async (transaction) => {
    for (const campus of campusSeed) {
      await transaction
        .insert(campuses)
        .values(campus)
        .onConflictDoUpdate({
          target: campuses.code,
          set: {
            name: campus.name,
            shortName: campus.shortName,
            locationLabel: campus.locationLabel,
            isActive: true,
            updatedAt: new Date(),
          },
        });
    }

    for (const program of programSeed) {
      await transaction
        .insert(programs)
        .values(program)
        .onConflictDoUpdate({
          target: programs.code,
          set: {
            campusId: program.campusId,
            name: program.name,
            shortName: program.shortName,
            isActive: true,
            updatedAt: new Date(),
          },
        });
    }

    for (const major of majorSeed) {
      await transaction
        .insert(programMajors)
        .values(major)
        .onConflictDoUpdate({
          target: [programMajors.programId, programMajors.code],
          set: {
            name: major.name,
            isActive: true,
            updatedAt: new Date(),
          },
        });
    }

    const fakePeople = [
      {
        id: seedIds.people.student,
        firstName: "Alex",
        lastName: "Teststudent",
      },
      {
        id: seedIds.people.applicant,
        firstName: "Jamie",
        lastName: "Testapplicant",
      },
      {
        id: seedIds.people.employee,
        firstName: "Taylor",
        lastName: "Testemployee",
      },
      {
        id: seedIds.people.records,
        firstName: "Riley",
        lastName: "Testrecords",
      },
      {
        id: seedIds.people.operations,
        firstName: "Morgan",
        lastName: "Testoperations",
      },
      {
        id: seedIds.people.technology,
        firstName: "Casey",
        lastName: "Testtechnology",
      },
      {
        id: seedIds.people.coordinator,
        firstName: "Jordan",
        lastName: "Testcoordinator",
      },
      {
        id: seedIds.people.schoolAdmin,
        firstName: "Avery",
        lastName: "Testadministrator",
      },
      {
        id: seedIds.people.facultyTechnology,
        firstName: "Quinn",
        lastName: "Testmultiporal",
      },
    ] as const;

    for (const person of fakePeople) {
      await transaction
        .insert(people)
        .values(person)
        .onConflictDoUpdate({
          target: people.id,
          set: {
            firstName: person.firstName,
            lastName: person.lastName,
            updatedAt: new Date(),
          },
        });
    }

    await transaction
      .insert(studentProfiles)
      .values({
        id: seedIds.profiles.student,
        personId: seedIds.people.student,
        studentNumber: "TEST-2027-0001",
        programId: seedIds.programs.bsis,
        yearLevel: 1,
        studentStatus: "ACTIVE",
      })
      .onConflictDoUpdate({
        target: studentProfiles.personId,
        set: {
          studentNumber: "TEST-2027-0001",
          programId: seedIds.programs.bsis,
          majorId: null,
          yearLevel: 1,
          studentStatus: "ACTIVE",
          updatedAt: new Date(),
        },
      });

    await transaction
      .insert(applicantProfiles)
      .values({
        id: seedIds.profiles.applicant,
        personId: seedIds.people.applicant,
        applicantNumber: "APP-TEST-0001",
        selectedProgramId: seedIds.programs.cpe,
        applicationStatus: "ACTIVE",
      })
      .onConflictDoUpdate({
        target: applicantProfiles.personId,
        set: {
          applicantNumber: "APP-TEST-0001",
          selectedProgramId: seedIds.programs.cpe,
          selectedMajorId: null,
          applicationStatus: "ACTIVE",
          updatedAt: new Date(),
        },
      });

    await transaction
      .insert(employeeProfiles)
      .values({
        id: seedIds.profiles.employee,
        personId: seedIds.people.employee,
        employeeNumber: "EMP-TEST-0001",
        departmentLabel: "Development Test Services",
        positionTitle: "Synthetic Test Employee",
        employmentStatus: "ACTIVE",
      })
      .onConflictDoUpdate({
        target: employeeProfiles.personId,
        set: {
          employeeNumber: "EMP-TEST-0001",
          departmentLabel: "Development Test Services",
          positionTitle: "Synthetic Test Employee",
          employmentStatus: "ACTIVE",
          updatedAt: new Date(),
        },
      });
  });
}
