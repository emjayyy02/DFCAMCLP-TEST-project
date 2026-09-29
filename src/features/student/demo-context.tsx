"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { StudentRequest } from "./demo-data";
import { studentDemoData } from "./demo-data";
import { useDemoProfilePhoto } from "@/components/ui/demo-profile-photo";

type StudentDemoContextValue = {
  requests: StudentRequest[];
  addRequest: (document: StudentRequest["document"]) => void;
  cancelRequest: (requestId: string) => void;
  profilePhoto: string | undefined;
  setProfilePhoto: (file: File | null) => void;
};

const StudentDemoContext = createContext<StudentDemoContextValue | null>(null);

export function StudentDemoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profilePhoto, setProfilePhoto] = useDemoProfilePhoto();
  const [requests, setRequests] = useState<StudentRequest[]>(() =>
    studentDemoData.requests.map((request) => ({ ...request })),
  );

  const addRequest = useCallback((document: StudentRequest["document"]) => {
    const submittedOn = new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());
    const id = `DEMO-REQ-${Date.now()}`;

    setRequests((current) => [
      { id, document, submittedOn, status: "Pending" },
      ...current,
    ]);
  }, []);

  const cancelRequest = useCallback((requestId: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId && request.status === "Pending"
          ? { ...request, status: "Cancelled" }
          : request,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      requests,
      addRequest,
      cancelRequest,
      profilePhoto,
      setProfilePhoto,
    }),
    [requests, addRequest, cancelRequest, profilePhoto, setProfilePhoto],
  );

  return (
    <StudentDemoContext.Provider value={value}>
      {children}
    </StudentDemoContext.Provider>
  );
}

export function useStudentDemo() {
  const context = useContext(StudentDemoContext);
  if (!context) {
    throw new Error("useStudentDemo must be used inside StudentDemoProvider.");
  }
  return context;
}
