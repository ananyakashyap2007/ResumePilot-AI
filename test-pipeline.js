const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function runTests() {
  console.log("==========================================");
  console.log("ResumePilot AI - Automated Verification");
  console.log("==========================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // Test 1: Sample Data availability
  console.log("\n--- Test Suite 1: Sample Data & Schemas ---");
  try {
    const { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME_TEXT } = require("./src/lib/sampleData.ts");
    assert(SAMPLE_JOB_DESCRIPTION && SAMPLE_JOB_DESCRIPTION.length > 100, "Sample JD loaded successfully");
    assert(SAMPLE_RESUME_TEXT && SAMPLE_RESUME_TEXT.includes("PROFESSIONAL EXPERIENCE"), "Sample Resume contains structured sections");
  } catch (e) {
    // If ts file directly required without ts-node, test reading file
    const sampleContent = fs.readFileSync(path.join(__dirname, "src/lib/sampleData.ts"), "utf-8");
    assert(sampleContent.includes("SAMPLE_JOB_DESCRIPTION"), "Sample JD defined in sampleData.ts");
    assert(sampleContent.includes("SAMPLE_RESUME_TEXT"), "Sample CV defined in sampleData.ts");
  }

  // Test 2: Text extraction engine test
  console.log("\n--- Test Suite 2: Document Extraction Library Tests ---");
  
  // Test DOCX extraction with mock docx buffer or sample text
  assert(typeof mammoth.extractRawText === "function", "Mammoth DOCX parser is loaded and available");
  
  // Test PDF parser module
  try {
    const pdfParse = require("pdf-parse");
    assert(typeof pdfParse === "function", "pdf-parse library is loaded and available");
  } catch (err) {
    assert(false, `pdf-parse loading error: ${err.message}`);
  }

  // Test 3: Gemini AI SDK initialization
  console.log("\n--- Test Suite 3: Gemini SDK Integration ---");
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const testAI = new GoogleGenerativeAI("test_key_format");
    assert(typeof testAI.getGenerativeModel === "function", "GoogleGenerativeAI client initializes correctly");
  } catch (err) {
    assert(false, `GoogleGenerativeAI init error: ${err.message}`);
  }

  // Test 4: Environment & Security Check
  console.log("\n--- Test Suite 4: Security & Environment Check ---");
  const gitignoreContent = fs.readFileSync(path.join(__dirname, ".gitignore"), "utf-8");
  assert(gitignoreContent.includes(".env*.local"), ".gitignore prevents leaking .env.local to Git/Vercel");
  assert(fs.existsSync(path.join(__dirname, ".env.example")), ".env.example template is present for users");

  console.log("\n==========================================");
  console.log(`Results: ${passed} of ${total} tests passed.`);
  console.log("==========================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
