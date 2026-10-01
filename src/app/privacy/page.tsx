import type { Metadata } from "next";
import { ProjectInformationPage } from "@/features/disclosure/project-information-page";
export const metadata: Metadata = {
  title: "Privacy & Data Notice — DFCAMCLP Portal Concept",
};
export default function Page() {
  return <ProjectInformationPage route="privacy" />;
}
