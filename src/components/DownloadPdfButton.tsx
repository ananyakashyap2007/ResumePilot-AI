"use client";

import React, { useState } from "react";
import { Download, Printer, Loader2, Check } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DownloadPdfButtonProps {
  candidateName?: string;
  targetElementId?: string;
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({
  candidateName = "Candidate",
  targetElementId = "printable-resume",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const cleanFileName = `${candidateName.trim().replace(/[^a-zA-Z0-9_-]/g, "_") || "Candidate"}_Tailored_Resume.pdf`;

  const handleDownloadPdf = async () => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      alert("Resume preview element not found. Please ensure the preview tab is open.");
      return;
    }

    try {
      setIsGenerating(true);

      // Render high-resolution canvas (scale: 2 for sharp vector-quality text)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 850,
      });

      const imgData = canvas.toDataURL("image/png");

      // Standard A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pageHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      // Additional pages if resume exceeds single page length
      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(cleanFileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to browser print dialog
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        type="button"
        onClick={handleNativePrint}
        className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        title="Print or Save via Browser Print Dialog"
      >
        <Printer className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">Print / Browser PDF</span>
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={isGenerating}
        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all ${
          downloadSuccess
            ? "bg-emerald-600 text-white shadow-emerald-200"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
        } ${isGenerating ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating A4 PDF...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <Check className="w-4 h-4" />
            <span>PDF Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download A4 PDF</span>
          </>
        )}
      </button>
    </div>
  );
};
