"use client";

import React, { useState } from "react";
import { TailoredResume } from "@/types/resume";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Edit3,
  Check,
  Copy,
} from "lucide-react";

interface ResumePreviewProps {
  resume: TailoredResume;
  onUpdateResume?: (updated: TailoredResume) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onUpdateResume,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedResume, setEditedResume] = useState<TailoredResume>(resume);
  const [copied, setCopied] = useState(false);

  // Sync if resume prop changes
  React.useEffect(() => {
    setEditedResume(resume);
  }, [resume]);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateResume) {
      onUpdateResume(editedResume);
    }
  };

  const handleCopyMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# ${editedResume.contactInfo.name}`);
    const contactParts = [
      editedResume.contactInfo.email,
      editedResume.contactInfo.phone,
      editedResume.contactInfo.location,
      editedResume.contactInfo.linkedin,
      editedResume.contactInfo.github,
    ].filter(Boolean);
    lines.push(contactParts.join(" | "));
    lines.push("\n## PROFESSIONAL SUMMARY");
    lines.push(editedResume.professionalSummary);
    lines.push("\n## TECHNICAL SKILLS");
    editedResume.skills.forEach((s) => {
      lines.push(`- **${s.category}:** ${s.items.join(", ")}`);
    });
    lines.push("\n## PROFESSIONAL EXPERIENCE");
    editedResume.workExperience.forEach((w) => {
      lines.push(`### ${w.role} - ${w.company} (${w.duration})`);
      w.achievements.forEach((a) => lines.push(`- ${a}`));
    });
    if (editedResume.projects && editedResume.projects.length > 0) {
      lines.push("\n## PROJECTS");
      editedResume.projects.forEach((p) => {
        lines.push(`### ${p.name} ${p.technologies ? `(${p.technologies.join(", ")})` : ""}`);
        p.description.forEach((d) => lines.push(`- ${d}`));
      });
    }
    lines.push("\n## EDUCATION");
    editedResume.education.forEach((e) => {
      lines.push(`### ${e.degree} - ${e.institution} (${e.year})`);
      if (e.highlights && e.highlights.length > 0) {
        lines.push(`- ${e.highlights.join(", ")}`);
      }
    });

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const r = editedResume;

  return (
    <div className="flex flex-col items-center">
      {/* Control Toolbar */}
      <div className="w-full max-w-[850px] mb-3 flex items-center justify-between text-xs text-slate-500 px-2 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">A4 Single-Column Preview</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
            ATS-Friendly
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors shadow-xs"
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? "Done Editing" : "Edit Details"}</span>
          </button>
        </div>
      </div>

      {/* Printable Single-Column A4 Resume Sheet */}
      <div
        id="printable-resume"
        className="w-full max-w-[850px] bg-white border border-slate-300 rounded-lg shadow-xl shadow-slate-200/50 p-8 sm:p-12 text-slate-900 font-sans leading-normal selection:bg-indigo-100 print:shadow-none print:border-none print:p-0 print:m-0"
        style={{ minHeight: "1100px" }}
      >
        {/* Header Section */}
        <header className="border-b-2 border-slate-900 pb-4 mb-5 text-center sm:text-left">
          {isEditing ? (
            <input
              type="text"
              value={r.contactInfo.name}
              onChange={(e) =>
                setEditedResume({
                  ...r,
                  contactInfo: { ...r.contactInfo, name: e.target.value },
                })
              }
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase border-b border-indigo-300 w-full focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              {r.contactInfo.name || "Candidate Name"}
            </h1>
          )}

          {/* Contact Bar */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium">
            {r.contactInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.email}</span>
              </span>
            )}
            {r.contactInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.phone}</span>
              </span>
            )}
            {r.contactInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.location}</span>
              </span>
            )}
            {r.contactInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.linkedin}</span>
              </span>
            )}
            {r.contactInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.github}</span>
              </span>
            )}
            {r.contactInfo.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-500 print:hidden" />
                <span>{r.contactInfo.portfolio}</span>
              </span>
            )}
          </div>
        </header>

        {/* 1. Professional Summary */}
        {r.professionalSummary && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
              Professional Summary
            </h2>
            {isEditing ? (
              <textarea
                value={r.professionalSummary}
                rows={4}
                onChange={(e) =>
                  setEditedResume({
                    ...r,
                    professionalSummary: e.target.value,
                  })
                }
                className="w-full text-xs text-slate-700 leading-relaxed border p-2 rounded focus:outline-none"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {r.professionalSummary}
              </p>
            )}
          </section>
        )}

        {/* 2. Technical / Core Skills */}
        {r.skills && r.skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
              Technical & Core Competencies
            </h2>
            <div className="space-y-1.5 text-xs text-slate-800">
              {r.skills.map((skillGroup, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-semibold text-slate-900 sm:w-44 shrink-0">
                    {skillGroup.category}:
                  </span>
                  <span className="text-slate-700 leading-normal flex-1">
                    {skillGroup.items.join(" • ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Professional Experience */}
        {r.workExperience && r.workExperience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2.5 font-mono">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {r.workExperience.map((job) => (
                <div key={job.id} className="text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{job.role}</span>
                      <span className="text-slate-700 font-semibold"> | {job.company}</span>
                      {job.location && (
                        <span className="text-slate-500"> ({job.location})</span>
                      )}
                    </div>
                    <span className="text-slate-600 font-medium text-[11px]">
                      {job.duration}
                    </span>
                  </div>

                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 leading-relaxed">
                    {job.achievements.map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Key Projects */}
        {r.projects && r.projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2.5 font-mono">
              Featured Projects
            </h2>
            <div className="space-y-3.5">
              {r.projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-slate-500 text-[11px]">
                          [{proj.technologies.join(", ")}]
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-indigo-600 text-[11px] underline">
                        {proj.link}
                      </span>
                    )}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 leading-relaxed">
                    {proj.description.map((desc, dIdx) => (
                      <li key={dIdx} className="pl-0.5">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Education */}
        {r.education && r.education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
              Education
            </h2>
            <div className="space-y-2.5">
              {r.education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-700"> • {edu.institution}</span>
                      {edu.location && (
                        <span className="text-slate-500"> ({edu.location})</span>
                      )}
                    </div>
                    <span className="text-slate-600 font-medium text-[11px]">{edu.year}</span>
                  </div>
                  {edu.scoreOrGpa && (
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">
                      GPA / Grade: {edu.scoreOrGpa}
                    </p>
                  )}
                  {edu.highlights && edu.highlights.length > 0 && (
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {edu.highlights.join(" • ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Certifications */}
        {r.certifications && r.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-mono">
              Certifications & Training
            </h2>
            <div className="space-y-1.5 text-xs">
              {r.certifications.map((cert, cIdx) => (
                <div key={cIdx} className="flex items-baseline justify-between">
                  <span className="font-medium text-slate-800">
                    {cert.name} {cert.issuer && <span className="text-slate-500">— {cert.issuer}</span>}
                  </span>
                  {cert.year && <span className="text-slate-500 text-[11px]">{cert.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
