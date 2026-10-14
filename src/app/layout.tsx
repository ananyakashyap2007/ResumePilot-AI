import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumePilot AI - ATS-Optimized AI Resume Tailoring",
  description:
    "Tailor your existing CV to match any job description with Google Gemini AI. 100% truth-preserving, single-column ATS layout, and instant A4 PDF download.",
  keywords: [
    "Resume Tailoring",
    "ATS Resume",
    "Gemini AI",
    "Skill Gap Analysis",
    "CV Builder",
    "Job Application",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
