import { describe, expect, it } from "vitest";
import {
  formatScheduleTime,
  studentDemoData,
} from "../features/student/demo-data";
import {
  academicDemoData,
  countAttendanceRecords,
  createUnmarkedAttendance,
  formatAcademicDate,
  getMissingGradeStudentIds,
  getOfferingRoster,
  getSubject,
} from "../features/academic/demo-data";
import { permittedNavigation } from "../server/access-control/navigation";
import { rolePermissionSeed } from "../server/access-control/seed-data";

describe("Academic portal sample experience", () => {
  it("keeps the fictional Student identity and current academic context coherent", () => {
    expect(studentDemoData.identity.fullName).toBe("John Paul Reyes");
    expect(studentDemoData.identity.yearLevel).toBe("3rd Year");
    expect(studentDemoData.term).toMatchObject({
      academicYear: "2026–2027",
      semester: "2nd Semester",
      section: "BSIS-3A",
    });
    expect(
      studentDemoData.curriculum.find(
        (term) => term.year === "3rd Year" && term.semester === "2nd Semester",
      )?.status,
    ).toBe("Current");

    const termKeys = new Set(
      studentDemoData.grades.map(
        (item) => `${item.academicYear} · ${item.semester}`,
      ),
    );
    expect(termKeys.size).toBeGreaterThanOrEqual(6);
    expect(
      studentDemoData.grades
        .filter(
          (item) =>
            item.academicYear === studentDemoData.term.academicYear &&
            item.semester === studentDemoData.term.semester,
        )
        .every(
          (item) => item.grade === null && item.status === "Not yet released",
        ),
    ).toBe(true);
    expect(formatScheduleTime("00:30")).toMatch(/12:30\s*AM/i);
    expect(formatScheduleTime("12:00")).toMatch(/12:00\s*PM/i);
    expect(formatScheduleTime("13:45")).toMatch(/1:45\s*PM/i);
  });

  it("keeps academic course offerings aligned with the Student demo schedule", () => {
    expect(academicDemoData.term.academicYear).toBe(
      studentDemoData.term.academicYear,
    );
    expect(academicDemoData.term.semester).toBe(studentDemoData.term.semester);

    for (const studentSubject of studentDemoData.subjects) {
      const offering = academicDemoData.offerings.find(
        (item) => item.subjectId === studentSubject.id,
      );
      expect(offering).toBeDefined();
      const academicSchedule = offering!.schedule
        .map((slot) => `${slot.day}|${slot.start}|${slot.end}|${slot.room}`)
        .sort();
      const studentSchedule = studentDemoData.schedule
        .filter((meeting) => meeting.subjectId === studentSubject.id)
        .map(
          (meeting) =>
            `${meeting.day}|${meeting.start}|${meeting.end}|${meeting.room}`,
        )
        .sort();
      expect(academicSchedule).toEqual(studentSchedule);
      expect(getSubject(offering!.subjectId)?.title).toBe(studentSubject.title);
      expect(
        academicDemoData.faculty.find(
          (person) => person.id === offering!.facultyId,
        )?.name,
      ).toBe(studentSubject.instructor);
    }

    const sampleStudent = academicDemoData.students.find(
      (student) => student.studentId === studentDemoData.identity.studentId,
    );
    expect(sampleStudent?.name).toBe(studentDemoData.identity.fullName);
    expect(sampleStudent?.section).toBe(studentDemoData.term.section);
  });

  it("starts new attendance sessions explicitly unmarked", () => {
    const records = createUnmarkedAttendance(["student-a", "student-b"]);
    expect(records).toEqual({
      "student-a": "Unmarked",
      "student-b": "Unmarked",
    });
    expect(countAttendanceRecords(records)).toEqual({
      present: 0,
      late: 0,
      absent: 0,
      unmarked: 2,
    });
  });

  it("keeps sample roster and attendance records complete", () => {
    for (const offering of academicDemoData.offerings) {
      expect(getOfferingRoster(offering.id)).toHaveLength(
        offering.studentIds.length,
      );
    }
    for (const session of academicDemoData.attendanceHistory) {
      const offering = academicDemoData.offerings.find(
        (item) => item.id === session.offeringId,
      );
      expect(offering).toBeDefined();
      expect(Object.keys(session.records).sort()).toEqual(
        [...offering!.studentIds].sort(),
      );
      expect(() => formatAcademicDate(session.savedOn)).not.toThrow();
    }
  });

  it("stores all grade-history dates in the ISO format used by the UI", () => {
    for (const book of academicDemoData.gradeBooks) {
      for (const date of [book.updatedOn, book.submittedOn]) {
        if (date) expect(() => formatAcademicDate(date)).not.toThrow();
      }
    }
    for (const entry of academicDemoData.submissionHistory) {
      expect(() => formatAcademicDate(entry.submittedOn)).not.toThrow();
    }
  });

  it("checks only that every final-grade row has a value", () => {
    expect(
      getMissingGradeStudentIds(["a", "b", "c"], {
        a: "1.50",
        b: "  ",
        c: "Pass",
      }),
    ).toEqual(["b"]);
  });

  it("shows announcements to academic roles while keeping management coordinator-only", () => {
    const facultyPaths = permittedNavigation(
      "ACADEMIC",
      rolePermissionSeed.FACULTY,
    ).map((item) => item.path);
    const coordinatorPaths = permittedNavigation(
      "ACADEMIC",
      rolePermissionSeed.PROGRAM_COORDINATOR,
    ).map((item) => item.path);

    expect(facultyPaths).toContain("/academic/announcements");
    expect(facultyPaths).not.toContain("/academic/management");
    expect(coordinatorPaths).toContain("/academic/announcements");
    expect(coordinatorPaths).toContain("/academic/management");
  });
});
