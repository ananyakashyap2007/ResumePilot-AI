"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { InputSection } from "@/components/InputSection";
import { ResumePreview } from "@/components/ResumePreview";
import { SkillGapAnalysis } from "@/components/SkillGapAnalysis";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TailoredResume, ResumeAnalysis } from "@/types/resume";
import {
  FileText,
  Sparkles,
  BarChart3,
  AlertCircle,
  KeyRound,
  ExternalLink,
  Code2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleResumeText, setSampleResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Results State
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [rawExtractedText, setRawExtractedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"resume" | "analysis" | "raw">("resume");

  const handleReset = () => {
    setJobDescription("");
    setSelectedFile(null);
    setSampleResumeText("");
    setTailoredResume(null);
    setAnalysis(null);
    setRawExtractedText(null);
    setErrorMessage(null);
  };

  const handleGenerate = async () => {
    setErrorMessage(null);

    if (!jobDescription.trim() || jobDescription.trim().length < 25) {
      setErrorMessage("Please enter a detailed Job Description (minimum 25 characters).");
      return;
    }

    if (!selectedFile && !sampleResumeText.trim()) {
      setErrorMessage("Please upload your CV (PDF/DOCX) or load the sample resume.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("jobDescription", jobDescription);

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (sampleResumeText) {
        formData.append("resumeText", sampleResumeText);
      }

      const res = await fetch("/api/tailor", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || `Server responded with status ${res.status}. Please check your inputs.`
        );
      }

      setTailoredResume(json.data.tailoredResume);
      setAnalysis(json.data.analysis);
      setRawExtractedText(json.data.rawExtractedTextPreview);
      setActiveTab("resume");

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("results-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred while communicating with the AI service."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered ATS Resume Optimization Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tailor Your Resume to Any Job in Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Upload your existing CV in PDF or DOCX format, paste the job description, and let Gemini AI tailor your bullet points with high-impact keywords while strictly preserving your real experience.
          </p>
        </section>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-rose-900 shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-bold text-rose-950">Generation Failed</p>
              <p className="text-xs sm:text-sm text-rose-800 mt-0.5 leading-relaxed">
                {errorMessage}
              </p>
              {errorMessage.includes("GEMINI_API_KEY") && (
                <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>How to fix this:</span>
                  </div>
                  <p>
                    1. Get a free Google Gemini API key at{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p>
                    2. Add <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">GEMINI_API_KEY=your_key</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">.env.local</code> file and restart the development server.
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Section (Exactly Two Input Fields: Job Description & Upload CV) */}
        <InputSection
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          resumeText={sampleResumeText}
          setResumeText={setSampleResumeText}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onReset={handleReset}
        />

        {/* Results Section */}
        {tailoredResume && analysis && (
          <section id="results-section" className="space-y-6 pt-4 scroll-mt-20">
            {/* Results Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("resume")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "resume"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tailored Resume</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("analysis")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "analysis"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Skill-Gap & Match ({analysis.matchScore}%)</span>
                </button>

                {rawExtractedText && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("raw")}
                    className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "raw"
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Extracted Text</span>
                  </button>
                )}
              </div>

              {/* PDF Download Trigger */}
              <DownloadPdfButton
                candidateName={tailoredResume.contactInfo?.name || "Candidate"}
                targetElementId="printable-resume"
              />
            </div>

            {/* Tab 1: ATS Resume Preview */}
            {activeTab === "resume" && (
              <div className="animate-in fade-in duration-300">
                <ResumePreview
                  resume={tailoredResume}
                  onUpdateResume={(updated) => setTailoredResume(updated)}
                />
              </div>
            )}

            {/* Tab 2: Skill-Gap Analysis */}
            {activeTab === "analysis" && (
              <div className="animate-in fade-in duration-300">
                <SkillGapAnalysis analysis={analysis} />
              </div>
            )}

            {/* Tab 3: Raw Extracted Text */}
            {activeTab === "raw" && rawExtractedText && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800">
                    Raw Extracted Text from Uploaded CV
                  </h3>
                  <span className="text-xs text-slate-400">Server Parser Output</span>
                </div>
                <pre className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-96">
                  {rawExtractedText}
                </pre>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">ResumePilot AI</span> • College Project
            Submission
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Built with Next.js, TypeScript & Tailwind CSS</span>
            <span className="text-indigo-600 font-medium">Google Gemini API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
