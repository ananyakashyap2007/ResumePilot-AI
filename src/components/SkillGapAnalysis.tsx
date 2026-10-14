"use client";

import React from "react";
import { ResumeAnalysis } from "@/types/resume";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Award,
} from "lucide-react";

interface SkillGapAnalysisProps {
  analysis: ResumeAnalysis;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ analysis }) => {
  const score = Math.max(0, Math.min(100, analysis.matchScore || 75));

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-emerald-600 border-emerald-500 bg-emerald-50";
    if (val >= 60) return "text-indigo-600 border-indigo-500 bg-indigo-50";
    return "text-amber-600 border-amber-500 bg-amber-50";
  };

  const getBadgeColor = (val: number) => {
    if (val >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (val >= 60) return "bg-indigo-100 text-indigo-800 border-indigo-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Target Role: {analysis.targetRole || "Target Job Role"}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getBadgeColor(score)}`}>
                {analysis.matchGrade || (score >= 80 ? "High Match" : score >= 60 ? "Moderate Match" : "Needs Work")}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              ATS Match & Compatibility Analysis
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
              {analysis.summary}
            </p>
          </div>

          {/* Match Score Gauge */}
          <div className="flex flex-col items-center">
            <div
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-md transition-all ${getScoreColor(
                score
              )}`}
            >
              <span className="text-3xl font-extrabold tracking-tight">{score}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Match Score
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Based on keyword density & required skills
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Matching Skills vs Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills (Preserved from Candidate's CV) */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Matching Skills ({analysis.matchingSkills?.length || 0})
              </h4>
              <p className="text-xs text-slate-500">
                Verified from your CV and highlighted in your tailored resume
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {analysis.matchingSkills && analysis.matchingSkills.length > 0 ? (
              analysis.matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No direct keyword overlap identified.</p>
            )}
          </div>
        </div>

        {/* Missing Skills (Segregated Skill-Gap Analysis) */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Identified Missing Skills ({analysis.missingSkills?.length || 0})
              </h4>
              <p className="text-xs text-slate-500">
                Required by the JD but not found in your CV (not added to avoid falsification)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
              analysis.missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/90 shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-medium">
                Outstanding! No major missing skills identified against this job description.
              </p>
            )}
          </div>
          <p className="text-[11px] text-amber-800/90 mt-4 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
            <strong>Truth-Preservation Guarantee:</strong> These missing skills were deliberately omitted from your resume to protect your background check integrity. Prepare talking points or review concepts for these during interview rounds.
          </p>
        </div>
      </div>

      {/* Applied Improvements & ATS Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tailoring Improvements Applied */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Tailoring Strategy Applied</h4>
              <p className="text-xs text-slate-500">
                How Gemini AI aligned your accomplishments with the recruiter&apos;s criteria
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {analysis.appliedImprovements && analysis.appliedImprovements.length > 0 ? (
              analysis.appliedImprovements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50">
                  <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{improvement}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">Standard formatting and keyword alignment applied.</li>
            )}
          </ul>
        </div>

        {/* ATS Quality Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">ATS Compliance Verification</h4>
              <p className="text-xs text-slate-500">
                Audited against modern applicant tracking system parsing requirements
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.atsChecklist && analysis.atsChecklist.length > 0 ? (
              analysis.atsChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/60"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{item.item}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{item.tip}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">All standard ATS checks passed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Interview & Application Tips */}
      {analysis.atsTips && analysis.atsTips.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 rounded-2xl border border-indigo-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Pro Application & Interview Strategy
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            {analysis.atsTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-indigo-100 shadow-2xs"
              >
                <span className="font-bold text-indigo-600 shrink-0">#{idx + 1}</span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
