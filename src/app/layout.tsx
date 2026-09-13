import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DFCAMCLP Portal — Development foundation",
  description:
    "Development foundation for the DFCAMCLP Integrated Student & Employee Portal.",
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
