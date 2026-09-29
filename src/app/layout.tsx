import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DFCAMCLP — Student & Staff Portal",
  description:
    "Explore DFCAMCLP programs, admissions guidance, and an unofficial student and staff portal concept for educational and portfolio purposes.",
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
