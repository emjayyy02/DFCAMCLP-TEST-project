import { asc, eq } from "drizzle-orm";
import type { Database } from "../connection";
import {
  applicantProfiles,
  campuses,
  people,
  programMajors,
  programs,
  studentProfiles,
} from "../schema";

export function getProgramsForCampusCode(
  database: Database,
  campusCode: string,
) {
  return database
    .select({
      campusCode: campuses.code,
      campusName: campuses.name,
      programCode: programs.code,
      programName: programs.name,
    })
    .from(campuses)
    .innerJoin(programs, eq(programs.campusId, campuses.id))
    .where(eq(campuses.code, campusCode))
    .orderBy(asc(programs.code));
}

export function getMajorsForProgramCode(
  database: Database,
  programCode: string,
) {
  return database
    .select({
      programCode: programs.code,
      majorCode: programMajors.code,
      majorName: programMajors.name,
    })
    .from(programs)
    .innerJoin(programMajors, eq(programMajors.programId, programs.id))
    .where(eq(programs.code, programCode))
    .orderBy(asc(programMajors.name));
}

export async function getStudentFoundation(
  database: Database,
  studentNumber: string,
) {
  const [student] = await database
    .select({
      studentNumber: studentProfiles.studentNumber,
      firstName: people.firstName,
      lastName: people.lastName,
      programCode: programs.code,
      programName: programs.name,
      campusCode: campuses.code,
      campusName: campuses.name,
      majorName: programMajors.name,
    })
    .from(studentProfiles)
    .innerJoin(people, eq(people.id, studentProfiles.personId))
    .innerJoin(programs, eq(programs.id, studentProfiles.programId))
    .innerJoin(campuses, eq(campuses.id, programs.campusId))
    .leftJoin(programMajors, eq(programMajors.id, studentProfiles.majorId))
    .where(eq(studentProfiles.studentNumber, studentNumber))
    .limit(1);

  return student ?? null;
}

export async function getApplicantFoundation(
  database: Database,
  applicantNumber: string,
) {
  const [applicant] = await database
    .select({
      applicantNumber: applicantProfiles.applicantNumber,
      firstName: people.firstName,
      lastName: people.lastName,
      programCode: programs.code,
      programName: programs.name,
      campusCode: campuses.code,
      campusName: campuses.name,
      majorName: programMajors.name,
    })
    .from(applicantProfiles)
    .innerJoin(people, eq(people.id, applicantProfiles.personId))
    .innerJoin(programs, eq(programs.id, applicantProfiles.selectedProgramId))
    .innerJoin(campuses, eq(campuses.id, programs.campusId))
    .leftJoin(
      programMajors,
      eq(programMajors.id, applicantProfiles.selectedMajorId),
    )
    .where(eq(applicantProfiles.applicantNumber, applicantNumber))
    .limit(1);

  return applicant ?? null;
}
