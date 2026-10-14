import mammoth from "mammoth";

/**
 * Clean and normalize extracted text
 */
function cleanExtractedText(rawText: string): string {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

/**
 * Fallback lightweight PDF text extractor from raw stream if pdf-parse encounters issues
 */
function extractTextFromPdfBufferFallback(buffer: Buffer): string {
  const content = buffer.toString("latin1");
  const textChunks: string[] = [];
  
  // Find strings in (text) Tj or [(t)(e)(x)(t)] TJ
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(content)) !== null) {
    textChunks.push(match[1]);
  }

  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(content)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]+)\)/g);
    if (subMatches) {
      const line = subMatches.map((s) => s.slice(1, -1)).join("");
      textChunks.push(line);
    }
  }

  return cleanExtractedText(textChunks.join(" "));
}

/**
 * Extract plain text from PDF buffer
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build-time issues with pdf-parse in Next.js
    // eslint-disable-next-line @typescript-eslint/no-var-ref
    const pdfParse = (await import("pdf-parse")).default || (await import("pdf-parse"));
    const data = await pdfParse(buffer);
    if (data && data.text && data.text.trim().length > 0) {
      return cleanExtractedText(data.text);
    }
  } catch (err) {
    console.warn("Primary pdf-parse failed, attempting stream extraction fallback:", err);
  }

  // Fallback
  const fallbackText = extractTextFromPdfBufferFallback(buffer);
  if (fallbackText && fallbackText.length > 50) {
    return fallbackText;
  }

  throw new Error(
    "Could not extract readable text from this PDF. Please ensure the PDF contains selectable text (not a scanned image)."
  );
}

/**
 * Extract plain text from DOCX buffer using mammoth
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = cleanExtractedText(result.value);
    if (!text || text.length === 0) {
      throw new Error("The DOCX file appears to be empty or contains only non-text elements.");
    }
    return text;
  } catch (err: any) {
    throw new Error(err.message || "Failed to extract text from DOCX document.");
  }
}

/**
 * Main parser entry point accepting Buffer and fileName/mimeType
 */
export async function extractResumeText(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<string> {
  const extension = fileName.toLowerCase().split(".").pop();

  if (extension === "pdf" || mimeType === "application/pdf") {
    return await extractTextFromPdf(buffer);
  }

  if (
    extension === "docx" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocx(buffer);
  }

  if (extension === "txt" || mimeType === "text/plain") {
    return cleanExtractedText(buffer.toString("utf-8"));
  }

  throw new Error(
    `Unsupported file format ".${extension}". ResumePilot AI supports PDF (.pdf) and Word (.docx) files.`
  );
}
