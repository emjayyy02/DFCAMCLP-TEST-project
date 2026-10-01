import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoPresentationProvider } from "@/features/identity/demo-presentation-provider";

const sourceSans = localFont({
  src: [
    {
      path: "../../public/fonts/SourceSans3-Regular.ttf.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SourceSans3-Semibold.ttf.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SourceSans3-Bold.ttf.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-interface",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
  adjustFontFallback: false,
});

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
    <html lang="en" className={sourceSans.variable}>
      <body>
        <DemoPresentationProvider>{children}</DemoPresentationProvider>
      </body>
    </html>
  );
}
