"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialApplication,
  requirements,
  scenarios,
  type ApplicationDraft,
  type ScenarioKey,
} from "./demo-data";
import { useDemoProfilePhoto } from "@/components/ui/demo-profile-photo";
import "./applicant.css";

function useDemoState() {
  const [profilePhoto, setProfilePhoto] = useDemoProfilePhoto();
  const [scenario, setScenario] = useState<ScenarioKey>("documents");
  const [draft, setDraft] = useState<ApplicationDraft>({
    ...initialApplication,
  });
  const [savedDraft, setSavedDraft] = useState<ApplicationDraft>({
    ...initialApplication,
  });
  const [savedAt, setSavedAt] = useState("");
  const [ready, setReady] = useState<string[]>(
    requirements.filter((item) => item.prepared).map((item) => item.name),
  );
  return {
    scenario,
    setScenario,
    profilePhoto,
    setProfilePhoto,
    state: scenarios[scenario],
    draft,
    setDraft,
    savedDraft,
    setSavedDraft,
    savedAt,
    setSavedAt,
    ready,
    setReady,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);

export function ApplicantDemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoState();
  return <DemoContext value={value}>{children}</DemoContext>;
}

export function useApplicantDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("Applicant demo requires its guarded layout.");
  return value;
}
