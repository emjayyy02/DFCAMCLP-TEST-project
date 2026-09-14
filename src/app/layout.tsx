import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DFCAMCLP — Integrated Student & Employee Portal",
  description:
    "Explore programs, admissions, and the DFCAMCLP student and employee portal concept. An unofficial educational and portfolio project.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
