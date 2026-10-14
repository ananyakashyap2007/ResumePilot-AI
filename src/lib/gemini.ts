import { GoogleGenerativeAI } from "@google/generative-ai";
import { TailoredResume, ResumeAnalysis } from "@/types/resume";

const CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
];

const SYSTEM_PROMPT = `
You are ResumePilot AI, an elite ATS (Applicant Tracking System) optimization specialist and executive resume strategist.
Your mission is to tailor an applicant's real CV to a target Job Description (JD) to maximize interview callbacks.

CRITICAL ETHICAL & ACCURACY RULES:
1. PRESERVE FACTUAL TRUTH: Never invent jobs, employers, dates, academic degrees, GPA, projects, or certifications. Every role and degree must reflect the candidate's actual provided background.
2. TAILOR & ALIGN REAL WORK: Re-frame, re-order, and optimize the candidate's actual duties and accomplishments using strong industry action verbs (e.g., "Architected", "Engineered", "Optimized", "Spearheaded") that highlight alignment with the JD's core competencies.
3. SKILL GAP SEGREGATION:
   - Identify "matchingSkills": Skills present in the candidate's CV that match the JD.
   - Identify "missingSkills": Skills demanded by the JD that the candidate does NOT possess. DO NOT add these missing skills to the resume itself. Present them exclusively in the skill-gap analysis so the candidate can prepare for interviews or upskill.
4. ATS COMPLIANCE:
   - Use standard single-column headers (Professional Summary, Core Competencies, Experience, Projects, Education, Certifications).
   - Ensure high keyword density for relevant technologies without keyword stuffing.
5. JSON OUTPUT: Output ONLY a strictly valid JSON object matching the requested schema. Do not include markdown code block backticks if possible, or wrap only in standard JSON.
`;

function buildPrompt(resumeText: string, jobDescription: string): string {
  return `
JOB DESCRIPTION:
\"\"\"
${jobDescription.trim()}
\"\"\"

CANDIDATE'S ORIGINAL RESUME CONTENT:
\"\"\"
${resumeText.trim()}
\"\"\"

TASK:
Analyze both inputs. Extract the candidate's real profile, tailor their experience and skills to match the target job description while adhering strictly to the truth. Generate a skill gap analysis and ATS optimization checklist.

Return a JSON object conforming exactly to this structure:
{
  "tailoredResume": {
    "contactInfo": {
      "name": "Candidate Full Name",
      "email": "candidate@example.com or empty if not provided",
      "phone": "+1 555-0199 or empty if not provided",
      "location": "City, Country or empty",
      "linkedin": "linkedin.com/in/... or empty",
      "github": "github.com/... or empty",
      "portfolio": "portfolio url or empty"
    },
    "professionalSummary": "A punchy, 3-4 sentence professional summary tightly tailored to the target role, highlighting the candidate's real years of experience, relevant tech stack, and primary value proposition.",
    "skills": [
      {
        "category": "e.g. Programming Languages / Core Technologies",
        "items": ["TypeScript", "Python", "SQL"]
      },
      {
        "category": "e.g. Frameworks & Libraries",
        "items": ["Next.js", "React", "Node.js"]
      },
      {
        "category": "e.g. Tools, Cloud & Practices",
        "items": ["Docker", "Git", "REST APIs", "Agile"]
      }
    ],
    "workExperience": [
      {
        "id": "exp-1",
        "role": "Exact or aligned job title from candidate CV",
        "company": "Company Name",
        "location": "City or Remote",
        "duration": "e.g. June 2022 - Present",
        "achievements": [
          "Action verb + what was done + relevant JD technology + quantifiable result/business impact",
          "Bullet point highlighting skills matching the target role"
        ]
      }
    ],
    "projects": [
      {
        "id": "proj-1",
        "name": "Project Name",
        "technologies": ["React", "TypeScript", "Tailwind CSS"],
        "link": "github/demo link if mentioned",
        "description": [
          "Concise bullet explaining architecture and features relevant to the target role",
          "Impact, performance optimization, or outcome"
        ]
      }
    ],
    "education": [
      {
        "id": "edu-1",
        "degree": "Candidate's real degree e.g. B.S. in Computer Science",
        "institution": "University / College Name",
        "location": "Location if present",
        "year": "e.g. 2020 - 2024",
        "scoreOrGpa": "GPA or score if stated in CV",
        "highlights": ["Relevant coursework, honors, or dean's list if stated"]
      }
    ],
    "certifications": [
      {
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "year": "Year"
      }
    ]
  },
  "analysis": {
    "matchScore": 85,
    "matchGrade": "High",
    "targetRole": "Extracted target role from JD e.g. Full Stack Developer",
    "summary": "2-3 sentence overview of how well the candidate's profile matches the job requirements and where the highest leverage alignments are.",
    "matchingSkills": ["Skills found in CV that match JD"],
    "missingSkills": ["Skills required by JD that candidate does not mention in their CV"],
    "appliedImprovements": [
      "Re-ordered technical skills to surface JD-priority languages first",
      "Re-framed work experience bullets with quantifiable metrics and active impact verbs",
      "Tailored summary to directly address the JD's primary responsibilities"
    ],
    "atsTips": [
      "Ensure your LinkedIn profile headline mirrors this target job title",
      "Prepare behavioral interview examples for the missing skills identified"
    ],
    "atsChecklist": [
      { "item": "Standard Single-Column Layout", "passed": true, "tip": "Single-column format easily parsed by Taleo, Workday, and Greenhouse." },
      { "item": "Keyword Density & Alignment", "passed": true, "tip": "Core job description technologies woven into bullets naturally." },
      { "item": "No Hallucinated Information", "passed": true, "tip": "Real candidate facts strictly preserved for background check safety." },
      { "item": "Impact & Metric Verbs", "passed": true, "tip": "Bullets structured with Action + Context + Result formula." }
    ]
  }
}
`;
}

function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  // Remove markdown code fences if present: ```json ... ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

export async function tailorResumeWithGemini(
  resumeText: string,
  jobDescription: string
): Promise<{ tailoredResume: TailoredResume; analysis: ResumeAnalysis }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your Google Gemini API key to .env.local to generate tailored resumes."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt(resumeText, jobDescription);

  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2, // Low temperature for high factual consistency
          responseMimeType: "application/json",
        },
        systemInstruction: SYSTEM_PROMPT,
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();

      if (!text) {
        throw new Error("Empty response received from Gemini model.");
      }

      const parsed = JSON.parse(cleanJsonResponse(text));
      if (!parsed.tailoredResume || !parsed.analysis) {
        throw new Error("Invalid response schema from Gemini API.");
      }

      return {
        tailoredResume: parsed.tailoredResume,
        analysis: parsed.analysis,
      };
    } catch (err: any) {
      console.warn(`Attempt with model ${modelName} failed:`, err.message || err);
      lastError = err;
      // If error is invalid API key, fail immediately without looping
      if (
        err.message?.includes("API_KEY_INVALID") ||
        err.message?.includes("API key not valid") ||
        err.message?.includes("unregistered project")
      ) {
        throw new Error("Invalid Gemini API Key. Please verify your GEMINI_API_KEY in .env.local.");
      }
    }
  }

  throw new Error(
    lastError?.message ||
      "Failed to generate tailored resume with Gemini API. Please check your network connection and API key."
  );
}
