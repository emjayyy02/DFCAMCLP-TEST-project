import type { Metadata } from "next";
import { ProjectInformationPage } from "@/features/disclosure/project-information-page";
export const metadata: Metadata = {
  title: "Demo Terms of Use — DFCAMCLP Portal Concept",
};
export default function Page() {
  return <ProjectInformationPage route="terms" />;
}
