"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  academicDemoData,
  createUnmarkedAttendance,
  getOffering,
  getOfferingRoster,
} from "./demo-data";
import type {
  AcademicAttendanceSession,
  AcademicGradeBook,
  AcademicSubmissionHistoryItem,
  AttendanceValue,
} from "./demo-data";

type AcademicActivity = {
  id: string;
  facultyId: string;
  label: string;
  offeringId: string;
  date: string;
};

type AcademicDemoContextValue = {
  attendanceSessions: AcademicAttendanceSession[];
  getAttendanceRecords: (
    offeringId: string,
    date: string,
  ) => Record<string, AttendanceValue>;
  setAttendanceRecord: (
    offeringId: string,
    date: string,
    studentId: string,
    value: AttendanceValue,
  ) => void;
  saveAttendance: (
    offeringId: string,
    date: string,
    records: Record<string, AttendanceValue>,
  ) => void;
  gradeBooks: Record<string, AcademicGradeBook>;
  updateGrade: (offeringId: string, studentId: string, value: string) => void;
  saveGradeDraft: (offeringId: string) => void;
  markGradesReady: (offeringId: string) => void;
  submitDemoGrades: (offeringId: string) => void;
  submissionHistory: AcademicSubmissionHistoryItem[];
  activity: AcademicActivity[];
};

const AcademicDemoContext = createContext<AcademicDemoContextValue | null>(
  null,
);

function attendanceKey(offeringId: string, date: string) {
  return `${offeringId}:${date}`;
}

function initialGradeBookMap() {
  return Object.fromEntries(
    academicDemoData.gradeBooks.map((book) => [
      book.offeringId,
      { ...book, grades: { ...book.grades } },
    ]),
  );
}

export function AcademicDemoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [attendanceSessions, setAttendanceSessions] = useState<
    AcademicAttendanceSession[]
  >(() =>
    academicDemoData.attendanceHistory.map((session) => ({
      ...session,
      records: { ...session.records },
    })),
  );
  const [attendanceDrafts, setAttendanceDrafts] = useState<
    Record<string, Record<string, AttendanceValue>>
  >({});
  const [gradeBooks, setGradeBooks] =
    useState<Record<string, AcademicGradeBook>>(initialGradeBookMap);
  const [submissionHistory, setSubmissionHistory] = useState<
    AcademicSubmissionHistoryItem[]
  >(() => academicDemoData.submissionHistory.map((entry) => ({ ...entry })));
  const [activity, setActivity] = useState<AcademicActivity[]>([]);

  const getAttendanceRecords = useCallback(
    (offeringId: string, date: string) => {
      const session = attendanceSessions.find(
        (item) => item.offeringId === offeringId && item.date === date,
      );
      if (session) return { ...session.records };

      const key = attendanceKey(offeringId, date);
      const savedDraft = attendanceDrafts[key];
      if (savedDraft) return { ...savedDraft };

      return createUnmarkedAttendance(
        getOfferingRoster(offeringId).map((student) => student.id),
      );
    },
    [attendanceDrafts, attendanceSessions],
  );

  const setAttendanceRecord = useCallback(
    (
      offeringId: string,
      date: string,
      studentId: string,
      value: AttendanceValue,
    ) => {
      if (
        attendanceSessions.some(
          (session) =>
            session.offeringId === offeringId && session.date === date,
        )
      ) {
        return;
      }

      const key = attendanceKey(offeringId, date);
      setAttendanceDrafts((current) => ({
        ...current,
        [key]: {
          ...(current[key] ??
            createUnmarkedAttendance(
              getOfferingRoster(offeringId).map((student) => student.id),
            )),
          [studentId]: value,
        },
      }));
    },
    [attendanceSessions],
  );

  const saveAttendance = useCallback(
    (
      offeringId: string,
      date: string,
      records: Record<string, AttendanceValue>,
    ) => {
      if (
        attendanceSessions.some(
          (session) =>
            session.offeringId === offeringId && session.date === date,
        )
      ) {
        return;
      }
      const session: AcademicAttendanceSession = {
        id: `demo-attendance-${offeringId}-${date}`,
        offeringId,
        date,
        savedOn: academicDemoData.today.date,
        records: { ...records },
      };
      setAttendanceSessions((current) => [session, ...current]);
      setActivity((current) => [
        {
          id: session.id,
          facultyId: getOffering(offeringId)?.facultyId ?? "",
          offeringId,
          label: "Attendance saved in this demo",
          date: academicDemoData.today.date,
        },
        ...current,
      ]);
    },
    [attendanceSessions],
  );

  const updateGrade = useCallback(
    (offeringId: string, studentId: string, value: string) => {
      setGradeBooks((current) => {
        const existing = current[offeringId];
        if (existing?.status === "Submitted") return current;
        const grades = existing?.grades ?? {};
        return {
          ...current,
          [offeringId]: {
            offeringId,
            status: "Draft",
            updatedOn: academicDemoData.today.date,
            grades: { ...grades, [studentId]: value },
          },
        };
      });
    },
    [],
  );

  const saveGradeDraft = useCallback(
    (offeringId: string) => {
      if (gradeBooks[offeringId]?.status === "Submitted") return;
      setGradeBooks((current) => {
        const existing = current[offeringId];
        if (existing?.status === "Submitted") return current;
        return {
          ...current,
          [offeringId]: {
            offeringId,
            status: "Draft",
            updatedOn: academicDemoData.today.date,
            grades:
              existing?.grades ??
              Object.fromEntries(
                getOfferingRoster(offeringId).map((student) => [
                  student.id,
                  "",
                ]),
              ),
          },
        };
      });
      const facultyId = getOffering(offeringId)?.facultyId ?? "";
      setActivity((current) => [
        {
          id: `grade-draft-${offeringId}`,
          facultyId,
          offeringId,
          label: "Grade draft saved in this demo",
          date: academicDemoData.today.date,
        },
        ...current,
      ]);
    },
    [gradeBooks],
  );

  const markGradesReady = useCallback((offeringId: string) => {
    setGradeBooks((current) => {
      const existing = current[offeringId];
      if (existing?.status === "Submitted") return current;
      const roster = getOfferingRoster(offeringId);
      const grades = existing?.grades ?? {};
      if (roster.some((student) => !grades[student.id]?.trim())) return current;
      return {
        ...current,
        [offeringId]: {
          offeringId,
          status: "Ready for Review",
          updatedOn: academicDemoData.today.date,
          grades,
        },
      };
    });
  }, []);

  const submitDemoGrades = useCallback(
    (offeringId: string) => {
      const offering = getOffering(offeringId);
      if (!offering) return;
      const subject = academicDemoData.subjects.find(
        (item) => item.id === offering.subjectId,
      );
      if (!subject) return;
      const current = gradeBooks[offeringId];
      if (
        current?.status !== "Ready for Review" ||
        offering.studentIds.some(
          (studentId) => !current.grades[studentId]?.trim(),
        )
      )
        return;

      setGradeBooks((current) => {
        const existing = current[offeringId];
        if (existing?.status === "Submitted") return current;
        return {
          ...current,
          [offeringId]: {
            offeringId,
            status: "Submitted",
            updatedOn: academicDemoData.today.date,
            submittedOn: academicDemoData.today.date,
            grades:
              existing?.grades ??
              Object.fromEntries(
                getOfferingRoster(offeringId).map((student) => [
                  student.id,
                  "",
                ]),
              ),
          },
        };
      });

      setSubmissionHistory((current) => [
        {
          id: `demo-submission-${offeringId}-${academicDemoData.today.date}`,
          offeringId,
          facultyId: offering.facultyId,
          subjectId: subject.id,
          section: offering.section,
          termLabel: academicDemoData.term.label,
          submittedOn: academicDemoData.today.date,
          studentCount: offering.studentIds.length,
          status: "Submitted",
        },
        ...current,
      ]);
      setActivity((current) => [
        {
          id: `grade-submission-${offeringId}`,
          facultyId: offering.facultyId,
          offeringId,
          label: "Demo grades submitted locally",
          date: academicDemoData.today.date,
        },
        ...current,
      ]);
    },
    [gradeBooks],
  );

  const value = useMemo(
    () => ({
      attendanceSessions,
      getAttendanceRecords,
      setAttendanceRecord,
      saveAttendance,
      gradeBooks,
      updateGrade,
      saveGradeDraft,
      markGradesReady,
      submitDemoGrades,
      submissionHistory,
      activity,
    }),
    [
      activity,
      attendanceSessions,
      getAttendanceRecords,
      gradeBooks,
      markGradesReady,
      saveAttendance,
      saveGradeDraft,
      setAttendanceRecord,
      submissionHistory,
      submitDemoGrades,
      updateGrade,
    ],
  );

  return (
    <AcademicDemoContext.Provider value={value}>
      {children}
    </AcademicDemoContext.Provider>
  );
}

export function useAcademicDemo() {
  const context = useContext(AcademicDemoContext);
  if (!context) {
    throw new Error(
      "useAcademicDemo must be used inside AcademicDemoProvider.",
    );
  }
  return context;
}
