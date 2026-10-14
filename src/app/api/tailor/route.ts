import { NextRequest, NextResponse } from "next/server";
import { extractResumeText } from "@/lib/extractText";
import { tailorResumeWithGemini } from "@/lib/gemini";
import { ApiResponse } from "@/types/resume";

export const maxDuration = 60; // Allow sufficient time for AI processing on Vercel/Node

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directResumeText = (formData.get("resumeText") as string) || "";
    const jobDescription = (formData.get("jobDescription") as string) || "";

    // 1. Validate Job Description
    if (!jobDescription || jobDescription.trim().length < 25) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a detailed Job Description (at least 25 characters) to tailor the resume effectively.",
        },
        { status: 400 }
      );
    }

    // 2. Extract or Obtain Resume Text
    let extractedText = "";

    if (file && typeof file.arrayBuffer === "function") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (buffer.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "The uploaded file is empty. Please upload a valid PDF or DOCX resume.",
          },
          { status: 400 }
        );
      }

      if (buffer.length > 8 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            error: "File size exceeds the 8MB limit. Please upload a smaller resume file.",
          },
          { status: 400 }
        );
      }

      try {
        extractedText = await extractResumeText(buffer, file.name, file.type);
      } catch (parseError: any) {
        return NextResponse.json(
          {
            success: false,
            error: `File extraction failed: ${parseError.message || "Could not read text from document."}`,
          },
          { status: 422 }
        );
      }
    } else if (directResumeText && directResumeText.trim().length > 30) {
      extractedText = directResumeText.trim();
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload your existing CV (PDF or DOCX format).",
        },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 40) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to extract enough text from the provided resume. Please make sure the document contains selectable text.",
        },
        { status: 422 }
      );
    }

    // 3. Tailor Resume with Gemini AI
    const { tailoredResume, analysis } = await tailorResumeWithGemini(
      extractedText,
      jobDescription
    );

    return NextResponse.json({
      success: true,
      data: {
        tailoredResume,
        analysis,
        rawExtractedTextPreview:
          extractedText.length > 600
            ? extractedText.substring(0, 600) + "..."
            : extractedText,
      },
    });
  } catch (error: any) {
    console.error("Tailor resume API error:", error);
    const message = error.message || "An unexpected error occurred while processing your request.";
    const status = message.includes("GEMINI_API_KEY") ? 401 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
