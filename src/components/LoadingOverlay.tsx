"use client";

import React, { useEffect, useState } from "react";
import { Loader2, FileSearch, Sparkles, BrainCircuit, CheckCircle2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

const STEPS = [
  {
    icon: FileSearch,
    title: "Extracting Document Content",
    description: "Parsing text, sections, and qualifications from your CV...",
  },
  {
    icon: BrainCircuit,
    title: "Analyzing Job Requirements",
    description: "Extracting core competencies, keywords, and qualifications from the JD...",
  },
  {
    icon: Sparkles,
    title: "Performing Skill-Gap Analysis",
    description: "Cross-referencing skills and calculating ATS match alignment...",
  },
  {
    icon: CheckCircle2,
    title: "Structuring Tailored ATS Resume",
    description: "Aligning bullet points with impact verbs while strictly preserving facts...",
  },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 relative">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Tailoring Your Resume</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Powered by Gemini AI • Please wait a few moments while we analyze and tailor your CV.
        </p>

        <div className="w-full mt-6 space-y-3.5 text-left">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-indigo-50/70 border border-indigo-200 text-indigo-900 shadow-sm"
                    : isDone
                    ? "bg-emerald-50/40 text-slate-700"
                    : "opacity-40 text-slate-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>{step.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                        Processing
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 mt-6 text-center">
          Strict fact-preservation active: Your real experience is never fabricated.
        </p>
      </div>
    </div>
  );
};
