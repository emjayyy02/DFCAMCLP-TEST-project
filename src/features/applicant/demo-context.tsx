"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialApplication,
  requirements,
  scenarios,
  type ApplicationDraft,
  type ScenarioKey,
} from "./demo-data";
import {
  useIdentityPhoto,
  useSignedInIdentity,
} from "@/features/identity/signed-in-identity";
import "./applicant.css";

function useDemoState() {
  const user = useSignedInIdentity();
  const application = {
    ...initialApplication,
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ").slice(1).join(" "),
    email: user.email,
  };
  const [profilePhoto, setProfilePhoto] = useIdentityPhoto();
  const [scenario, setScenario] = useState<ScenarioKey>("documents");
  const [draft, setDraft] = useState<ApplicationDraft>({
    ...application,
  });
  const [savedDraft, setSavedDraft] = useState<ApplicationDraft>({
    ...application,
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
