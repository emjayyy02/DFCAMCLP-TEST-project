"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialApplicants,
  initialStudents,
  nextEnrollmentStep,
  validSampleSchedule,
  type ApplicantRecord,
  type DocumentStatus,
  type ExamStatus,
  type RequirementStatus,
  type StudentRecord,
} from "./demo-data";

function useDemoState() {
  const [applicants, setApplicants] =
    useState<ApplicantRecord[]>(initialApplicants);
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [feedback, setFeedback] = useState("");

  function updateApplicant(
    id: string,
    update: (record: ApplicantRecord) => ApplicantRecord,
    message: string,
  ) {
    setApplicants((current) =>
      current.map((record) => (record.id === id ? update(record) : record)),
    );
    setFeedback(message);
  }
  function setRequirement(id: string, name: string, status: RequirementStatus) {
    if (applicants.find((item) => item.id === id)?.dcat) return false;
    updateApplicant(
      id,
      (record) => {
        const requirements = record.requirements.map((item) =>
          item.name === name ? { ...item, status } : item,
        );
        const complete = requirements.every(
          (item) => item.status === "Verified",
        );
        return {
          ...record,
          requirements,
          stage:
            complete && !record.dcat
              ? "Eligible for DCAT"
              : !complete && !record.dcat
                ? "Requirements review"
                : record.stage,
        };
      },
      `${name}: ${status}. Sample change saved for this browser session.`,
    );
    return true;
  }
  function scheduleDcat(id: string, date: string, time: string, room: string) {
    const record = applicants.find((item) => item.id === id);
    if (
      !record ||
      !record.requirements.every((item) => item.status === "Verified") ||
      !validSampleSchedule(date, time, room)
    )
      return false;
    updateApplicant(
      id,
      (item) => ({
        ...item,
        stage: "DCAT scheduled",
        dcat: { status: "Awaiting Exam", date, time, room: room.trim() },
      }),
      `DCAT schedule saved for ${record.name}. This is a demo change only; no notification was sent.`,
    );
    return true;
  }
  function setExamStatus(id: string, status: ExamStatus) {
    const record = applicants.find((item) => item.id === id);
    if (!record?.dcat) return false;
    if (status === "Awaiting Result" && record.dcat.status !== "Awaiting Exam")
      return false;
    if (
      (status === "Passed" || status === "Not Qualified") &&
      record.dcat.status !== "Awaiting Result"
    )
      return false;
    updateApplicant(
      id,
      (item) => ({
        ...item,
        stage:
          status === "Passed"
            ? "For enrollment"
            : status === "Not Qualified"
              ? "Not Qualified"
              : "Awaiting result",
        dcat: { ...item.dcat!, status },
        enrollment: status === "Passed" ? "For Enrollment" : item.enrollment,
      }),
      `${record.name}: ${status}. Sample result recorded for this browser session.`,
    );
    return true;
  }
  function advanceEnrollment(id: string) {
    const record = applicants.find((item) => item.id === id);
    if (!record) return false;
    const next = nextEnrollmentStep(record);
    if (!next) return false;
    updateApplicant(
      id,
      (item) => ({
        ...item,
        enrollment: next,
        stage: next === "Enrolled" ? "Enrolled" : next,
        coe: next === "COE Available" ? "Available" : item.coe,
        cor: next === "COR Available" ? "Available" : item.cor,
      }),
      `${record.name}: ${next}. Sample progression saved for this browser session.`,
    );
    return true;
  }
  function setApplicantDocument(
    id: string,
    kind: "coe" | "cor",
    status: DocumentStatus,
  ) {
    const record = applicants.find((item) => item.id === id);
    if (!record || (record[kind] === "Not Available" && status === "Issued"))
      return false;
    updateApplicant(
      id,
      (item) => {
        const enrollment =
          status === "Issued" &&
          kind === "coe" &&
          item.enrollment === "COE Available"
            ? "COE Issued"
            : status === "Issued" &&
                kind === "cor" &&
                item.enrollment === "COR Available"
              ? "COR Issued"
              : item.enrollment;
        return {
          ...item,
          [kind]: status,
          enrollment,
          stage: enrollment === item.enrollment ? item.stage : enrollment,
        };
      },
      `${kind.toUpperCase()} marked ${status} for ${record.name}. Demo status only.`,
    );
    return true;
  }
  function setStudentDocument(
    id: string,
    kind: "coe" | "cor",
    status: DocumentStatus,
  ) {
    const record = students.find((item) => item.id === id);
    if (!record || (record[kind] === "Not Available" && status === "Issued"))
      return false;
    setStudents((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [kind]: status } : item,
      ),
    );
    setFeedback(
      `${kind.toUpperCase()} marked ${status} for ${record.name}. Demo status only.`,
    );
    return true;
  }
  return {
    applicants,
    students,
    feedback,
    setFeedback,
    setRequirement,
    scheduleDcat,
    setExamStatus,
    advanceEnrollment,
    setApplicantDocument,
    setStudentDocument,
  };
}

const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function RecordsDemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoState();
  return <DemoContext value={value}>{children}</DemoContext>;
}
export function useRecordsDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("Records demo requires its guarded layout.");
  return value;
}
