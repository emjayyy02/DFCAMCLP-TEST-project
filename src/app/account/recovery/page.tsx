import type { Metadata } from "next";
import Link from "next/link";
import {
  ApplicantRecoveryPreview,
  PreviewHeading,
  SupportRequestPreview,
} from "@/features/identity/account-entry";
import { SiteShell } from "@/components/public/site-shell";
export const metadata: Metadata = {
  title: "Account recovery — DFCAMCLP Portal Concept",
};
export default function AccountRecoveryPage() {
  return (
    <SiteShell>
      <main id="main" className="public-page">
        <div className="public-container identity-flow preview-page">
          <PreviewHeading
            title="Account recovery"
            intro="Choose how we can help."
          >
            <p>
              Use fictional details only. No real email service or support
              backend is connected. Recovery emails and support requests are
              local previews; nothing is sent to an administrator.
            </p>
            <p>
              Images stay in page memory, are never uploaded, and disappear on
              refresh or leaving this page. Choose PNG, JPEG, or WebP up to 5
              MB.
            </p>
          </PreviewHeading>
          <ApplicantRecoveryPreview />
          <SupportRequestPreview />
          <Link href="/login" className="text-link preview-back">
            Return to sign in
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
