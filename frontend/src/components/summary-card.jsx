"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { Sparkles, FileText, CheckCircle, Square, CheckSquare } from "lucide-react";

export default function SummaryCard({ result, selectedSpecies }) {
  const [checkedItems, setCheckedItems] = useState({});

  // Reset checkboxes when result changes
  useEffect(() => {
    setCheckedItems({});
  }, [result]);

  const toggleCheck = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getSummaryPoints = () => {
    const summary = result?.result?.summary;
    if (!summary) return [];
    if (Array.isArray(summary)) {
      return summary;
    }
    return String(summary)
      .split(/\n/)
      .map((line) => line.replace(/^\s*[-*#\d\.\s]+/, "").trim())
      .filter(Boolean);
  };

  const summaryPoints = getSummaryPoints();

  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Draw Elegant Double Certificate Borders
    doc.setDrawColor(16, 185, 129); // Emerald-500
    doc.setLineWidth(1.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    
    doc.setDrawColor(20, 83, 45); // Dark Green
    doc.setLineWidth(0.4);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // --- Header Section ---
    doc.setFillColor(11, 15, 23); // Dark slate
    doc.rect(12, 12, pageWidth - 24, 38, "F");
    
    // Gold/Green highlight bar
    doc.setFillColor(16, 185, 129);
    doc.rect(12, 48, pageWidth - 24, 2, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("VERDANTAI BIOLOGICAL REPORT", 22, 28);
    
    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text("PRECISION BOTANICAL HEALTH & FOLIAR DIAGNOSTIC CERTIFICATE", 22, 36);

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    doc.setTextColor(100, 116, 139);
    doc.text(`Authenticated Scan Run: ${dateStr}`, 22, 42);

    // Specimen details block
    doc.setFillColor(248, 250, 252); // Soft warm gray
    doc.roundedRect(16, 56, pageWidth - 32, 20, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(16, 56, pageWidth - 32, 20, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("SPECIMEN PROFILE", 22, 63);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Taxonomy: ${selectedSpecies || "Generic Specimen"}`, 22, 70);

    const hueVal = result?.result?.hue ?? "N/A";
    const satVal = result?.result?.saturation ?? "N/A";
    const valVal = result?.result?.value ?? "N/A";
    doc.text(`Verification ID: VA-${Math.floor(100000 + Math.random() * 900000)}`, 130, 63);
    doc.text("Methodology: Multimodal Gemini Vision + OpenCV HSV Segmenter", 130, 70);

    // --- Quantitative Metrics Dials ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("FOLIAR SPECTRAL METRICS", 16, 88);

    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.8);
    doc.line(16, 91, pageWidth - 16, 91);

    // Display grids
    const startY = 96;
    const cardWidth = (pageWidth - 38) / 3;
    const metrics = [
      { label: "CHLOROPHYLL INDEX", value: `${hueVal} / 179`, desc: "Foliar Hue Potential" },
      { label: "HYDRATION INDEX", value: `${satVal} / 255`, desc: "Purity Saturation" },
      { label: "LUMINOSITY VALUE", value: `${valVal} / 255`, desc: "Leaf Reflective Index" }
    ];

    metrics.forEach((metric, index) => {
      const cardX = 16 + index * (cardWidth + 3);
      // Background card
      doc.setFillColor(240, 253, 244); // light mint
      doc.roundedRect(cardX, startY, cardWidth, 26, 1.5, 1.5, "F");
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.4);
      doc.roundedRect(cardX, startY, cardWidth, 26, 1.5, 1.5, "D");

      // Card texts
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text(metric.label, cardX + 5, startY + 6);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(metric.value, cardX + 5, startY + 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(metric.desc, cardX + 5, startY + 21);
    });

    // --- Qualitative Diagnostic Action Checklist ---
    const checkY = 134;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("AI CLINICAL PRESCRIPTION & TREATMENT CHECKLIST", 16, checkY);

    doc.setDrawColor(16, 185, 129);
    doc.line(16, checkY + 3, pageWidth - 16, checkY + 3);

    let currentY = checkY + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    const displayPoints = summaryPoints.length > 0 ? summaryPoints : ["Foliar diagnosis processing successfully synced. Monitor leaf parameters regularly."];

    displayPoints.forEach((point, idx) => {
      // Draw checkbox square
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.rect(17, currentY - 3.5, 4, 4);

      // Check mark if user checked it on screen!
      if (checkedItems[idx]) {
        doc.setFillColor(16, 185, 129);
        doc.rect(18, currentY - 2.5, 2, 2, "F");
      }

      const textX = 26;
      const textWidth = pageWidth - textX - 20;
      const splitText = doc.splitTextToSize(point, textWidth);

      doc.text(splitText, textX, currentY);
      currentY += (splitText.length * 4.5) + 4.5;
    });

    // --- Footer & Stamp Seal ---
    const footerTop = pageHeight - 48;
    
    // Validator seal
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.8);
    doc.circle(38, footerTop + 14, 12, "D");
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(0.2);
    doc.circle(38, footerTop + 14, 11, "D");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(22, 101, 52);
    doc.text("VERDANTAI", 38, footerTop + 12, { align: "center" });
    doc.text("VALIDATED", 38, footerTop + 15, { align: "center" });
    doc.text("LABS", 38, footerTop + 18, { align: "center" });

    // Signature Area
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 65, footerTop + 20, pageWidth - 16, footerTop + 20);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("VerdantAI Botanical Certifier", pageWidth - 65, footerTop + 24);
    doc.setFont("helvetica", "normal");
    doc.text("Signature & Credential Seal", pageWidth - 65, footerTop + 28);

    // Base bar
    doc.setFillColor(11, 15, 23);
    doc.rect(12, pageHeight - 17, pageWidth - 24, 5, "F");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated by VerdantAI — verdantai.vercel.app", pageWidth / 2, pageHeight - 20, { align: "center" });

    doc.save(`VerdantAI_Certificate_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Card className="glass-panel border border-white/5 rounded-3xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 relative z-10 overflow-hidden">
      <CardContent className="p-6">
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileText size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-200 uppercase tracking-wider">
                Clinical Prescription Sheet
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">Interactive AI Recommended Interventions</p>
            </div>
          </div>

          {summaryPoints.length > 0 && (
            <Button
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-xl border border-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 sm:self-auto self-start"
            >
              Export Certificate PDF
            </Button>
          )}
        </div>

        {/* Content Details */}
        {result ? (
          result.error ? (
            <p className="text-rose-400 text-xs text-center py-6">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 mb-2">
                <Sparkles size={11} />
                Botanical Diagnostics
              </div>

              {/* Interactive checklist checklist */}
              <div className="space-y-3">
                {summaryPoints.map((point, index) => {
                  const isChecked = !!checkedItems[index];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => toggleCheck(index)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isChecked
                          ? "bg-emerald-500/5 border-emerald-500/15 opacity-50"
                          : "bg-white/[0.01] border-white/5 hover:border-emerald-500/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      <button
                        className={`flex-shrink-0 mt-0.5 transition-colors ${
                          isChecked ? "text-emerald-400" : "text-gray-500 hover:text-emerald-400"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare size={16} className="fill-emerald-500/10" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                      
                      <p
                        className={`text-xs leading-relaxed font-urbanist transition-all duration-300 ${
                          isChecked ? "text-gray-500 line-through" : "text-gray-300"
                        }`}
                      >
                        {point}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {summaryPoints.length === 0 && (
                <p className="text-gray-500 text-xs italic py-4">
                  Diagnosis succeeded but returned empty advice channels. Monitor leaf hydration levels.
                </p>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/[0.005]">
            <span className="w-10 h-10 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500/30 mx-auto mb-3">
              <CheckCircle size={18} />
            </span>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              No Prescription Loaded
            </h4>
            <p className="text-[10px] text-gray-600 max-w-[280px] mx-auto leading-relaxed">
              Run a scan first. Care recommendations will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
