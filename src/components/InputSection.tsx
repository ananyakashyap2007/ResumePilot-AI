"use client";

import React, { useRef, useState, DragEvent } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  X,
  FileCheck2,
  FileCode2,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME_TEXT } from "@/lib/sampleData";

interface InputSectionProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  resumeText: string;
  setResumeText: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onReset: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  selectedFile,
  setSelectedFile,
  resumeText,
  setResumeText,
  onGenerate,
  isLoading,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validExtensions = [".pdf", ".docx"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setFileError("Invalid file type. Please upload a PDF (.pdf) or Word document (.docx).");
      setSelectedFile(null);
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFileError("File exceeds 8MB limit. Please upload a smaller document.");
      setSelectedFile(null);
      return;
    }

    // Clear direct sample resume text if real file uploaded
    setResumeText("");
    setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleJD = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleLoadSampleResume = () => {
    setSelectedFile(null);
    setFileError(null);
    setResumeText(SAMPLE_RESUME_TEXT);
  };

  const hasCv = selectedFile !== null || resumeText.trim().length > 0;
  const hasJd = jobDescription.trim().length >= 25;
  const canGenerate = hasCv && hasJd && !isLoading;

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8 transition-all">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tailor Your CV in Seconds</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              2 Simple Steps
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide the target job description and your current CV. ResumePilot AI optimizes your bullet points and calculates your match score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Exactly Two Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field 1: Job Description */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="job-description-input"
              className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Job Description</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleJD}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1"
                title="Populate with a full-stack engineer job posting"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample JD</span>
              </button>
              {jobDescription.length > 0 && (
                <button
                  type="button"
                  onClick={() => setJobDescription("")}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              id="job-description-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, required qualifications, key technologies)..."
              rows={11}
              className="w-full h-full min-h-[260px] p-4 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition-all placeholder:text-slate-400 leading-relaxed font-sans"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white/90 px-2 py-0.5 rounded border border-slate-200/60 pointer-events-none">
              {jobDescription.trim().length} chars •{" "}
              {jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0} words
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Tip: Include required skills and responsibilities for highest keyword accuracy.
          </p>
        </div>

        {/* Field 2: Upload Existing CV */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Upload Existing CV</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleResume}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1"
                title="Populate with a realistic candidate CV for immediate testing"
              >
                <Sparkles className="w-3 h-3" />
                <span>Try Sample Resume</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[260px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/60 scale-[0.99]"
                : selectedFile || resumeText
                ? "border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/30"
                : "border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <FileCheck2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 max-w-xs truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                    {selectedFile.name.endsWith(".pdf") ? "PDF Document" : "Word Document"}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    <CheckCircle className="w-3 h-3" /> Ready for Analysis
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : resumeText ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                  <FileCode2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Sample Candidate CV Loaded
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Alexander Rivers • Software Engineer ({resumeText.length} chars)
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                    <CheckCircle className="w-3 h-3" /> Sample Active
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeText("");
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Clear sample"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Drag and drop your resume here, or{" "}
                    <span className="text-indigo-600 hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports <span className="font-medium text-slate-600">PDF (.pdf)</span> and{" "}
                    <span className="font-medium text-slate-600">Word (.docx)</span> up to 8MB
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 bg-white/80 border border-slate-200/80 px-3 py-1 rounded-full shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Real text extraction via server parser</span>
                </div>
              </div>
            )}
          </div>

          {fileError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Your existing qualifications, education, and jobs are 100% preserved.
          </p>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          {!hasJd && !hasCv ? (
            <span className="text-slate-400">Step 1: Paste JD & Step 2: Upload CV to begin</span>
          ) : !hasJd ? (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Please provide the target Job Description
            </span>
          ) : !hasCv ? (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Please upload your CV or use the sample
            </span>
          ) : (
            <span className="text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> All inputs valid! Ready to generate.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 ${
            canGenerate
              ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Updated Resume</span>
        </button>
      </div>
    </section>
  );
};
