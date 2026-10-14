export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  duration: string;
  achievements: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies?: string[];
  link?: string;
  description: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  year: string;
  scoreOrGpa?: string;
  highlights?: string[];
}

export interface CertificationItem {
  name: string;
  issuer?: string;
  year?: string;
}

export interface TailoredResume {
  contactInfo: ContactInfo;
  professionalSummary: string;
  skills: SkillCategory[];
  workExperience: WorkExperience[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
}

export interface AtsChecklistItem {
  item: string;
  passed: boolean;
  tip: string;
}

export interface ResumeAnalysis {
  matchScore: number;
  matchGrade: "High" | "Moderate" | "Needs Improvement";
  targetRole: string;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  appliedImprovements: string[];
  atsTips: string[];
  atsChecklist: AtsChecklistItem[];
}

export interface ApiResponseData {
  tailoredResume: TailoredResume;
  analysis: ResumeAnalysis;
  rawExtractedTextPreview: string;
}

export interface ApiResponse {
  success: boolean;
  data?: ApiResponseData;
  error?: string;
}
