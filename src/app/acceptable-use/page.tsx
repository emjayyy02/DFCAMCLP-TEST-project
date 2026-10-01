import type { Metadata } from "next";
import { ProjectInformationPage } from "@/features/disclosure/project-information-page";
export const metadata: Metadata = {
  title: "Acceptable Use — DFCAMCLP Portal Concept",
};
export default function Page() {
  return <ProjectInformationPage route="acceptable-use" />;
}
