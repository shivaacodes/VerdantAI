"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import UploadCard from "@/components/upload-card";
import AnalysisCard from "@/components/analysis-card";
import SummaryCard from "@/components/summary-card";
import { History, Trash, Database, Leaf, ShieldAlert, Sparkles } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PLANT_SPECIES = [
  { value: "Monstera", label: "Monstera Deliciosa" },
  { value: "Tomato", label: "Tomato (Solanum lycopersicum)" },
  { value: "Fiddle Leaf Fig", label: "Fiddle Leaf Fig (Ficus lyrata)" },
  { value: "Pothos", label: "Golden Pothos (Epipremnum aureum)" },
  { value: "Rose", label: "Garden Rose (Rosa)" },
  { value: "Generic Plant", label: "Generic Plant / Unspecified" }
];

export default function AnalyzeSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState("Monstera");
  const [result, setResult] = useState(null);
  
  // Interactive Scanning States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState("");
  const [scanProgress, setScanProgress] = useState(0);

  // Local History State
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("verdantai_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load diagnostic history:", e);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setSelectedImage({ file, preview: e.target.result });
      reader.readAsDataURL(file);
      setResult(null); // Clear previous results on new upload
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage?.file) return;

    setIsScanning(true);
    setScanProgress(0);

    // Timeline Sweep Simulation for Recruiter Wow Factor
    const runSimulationStep = (text, progress, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setScanStepText(text);
          setScanProgress(progress);
          resolve();
        }, delay);
      });
    };

    try {
      // Step 1: Preprocessing & OpenCV
      await runSimulationStep("Isolating boundary pixels... [OpenCV]", 15, 800);
      
      // Step 2: HSV color extraction
      await runSimulationStep("Extracting chlorophyll saturation channels...", 45, 900);
      
      // Step 3: Querying multimodal Gemini Vision
      await runSimulationStep(`Fusing payloads & querying Gemini AI for ${selectedSpecies}...`, 75, 1000);

      const formData = new FormData();
      formData.append("file", selectedImage.file);
      formData.append("species", selectedSpecies);

      console.log(`Querying VerdantAI API at: ${API_BASE_URL}...`);
      const response = await axios.post(
        `${API_BASE_URL}/api/process-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      await runSimulationStep("Compiling leaf metrics certificate...", 100, 500);

      const data = response.data;
      setResult(data);

      // Append new scan to history if successful
      if (data && !data.error) {
        const newHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
          species: selectedSpecies,
          preview: selectedImage.preview,
          result: data.result
        };

        const updatedHistory = [newHistoryItem, ...history.slice(0, 9)]; // Max 10 items
        setHistory(updatedHistory);
        localStorage.setItem("verdantai_history", JSON.stringify(updatedHistory));
      }

    } catch (error) {
      console.error("Diagnostic analysis pipeline encountered an error:", error);
      setResult({ error: "Foliar processing pipeline failed. Please ensure backend is online." });
    } finally {
      setIsScanning(false);
      setScanStepText("");
    }
  };

  const loadHistoryItem = (item) => {
    setSelectedSpecies(item.species);
    setSelectedImage({ preview: item.preview, file: null }); // local preview loader
    setResult({ result: item.result });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("verdantai_history");
  };

  return (
    <section className="py-12 md:py-16 bg-[#07090e] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-teal-500/5 blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
            INTELLIGENT CONSOLE
          </span>
          <h2 className="text-4xl sm:text-5xl font-black font-urbanist text-white mt-6 mb-4">
            Interactive Diagnostic Workspace
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Choose a species, drop a leaf photo, and initiate our real-time multimodal scanning diagnostic payload.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Local Scan History Sidebar (Recruiter Wow Factor) */}
          <div className="lg:col-span-3 order-3 lg:order-1 glass-panel p-5 rounded-3xl h-[475px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                <div className="flex items-center gap-2 font-bold text-gray-200 text-sm tracking-tight">
                  <History size={16} className="text-emerald-400" />
                  <span>Scan Registry</span>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                    title="Clear history"
                  >
                    <Trash size={13} />
                  </button>
                )}
              </div>

              {/* History scroll zone */}
              <div className="space-y-2 max-h-[330px] overflow-y-auto pr-1">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
                    <Database size={24} className="mb-2 opacity-50" />
                    <p className="text-xs">No entries found in registry</p>
                    <p className="text-[10px] opacity-75 mt-1">Past diagnostics save here automatically</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-emerald-500/20 text-left transition-all group"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={item.preview} alt="Thumb" className="object-cover w-full h-full" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-200 group-hover:text-emerald-400 transition truncate">
                          {item.species}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {item.date} • {item.timestamp}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Simulated Cloud Synced Indicator */}
            <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Local Cache Synced
              </span>
              <span>100% Secure</span>
            </div>
          </div>

          {/* MIDDLE COLUMN: Upload Card Console */}
          <div className="lg:col-span-5 order-1 lg:order-2 h-[475px]">
            <UploadCard
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              handleImageUpload={handleImageUpload}
              handleAnalyze={handleAnalyze}
              selectedSpecies={selectedSpecies}
              setSelectedSpecies={setSelectedSpecies}
              plantSpeciesList={PLANT_SPECIES}
              isScanning={isScanning}
              scanStepText={scanStepText}
              scanProgress={scanProgress}
            />
          </div>

          {/* RIGHT COLUMN: Diagnostic Outcome HUD */}
          <div className="lg:col-span-4 order-2 lg:order-3 h-[475px]">
            <AnalysisCard result={result} isScanning={isScanning} />
          </div>

        </div>

        {/* BOTTOM SECTION: Care Prescription & PDF Engine */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <SummaryCard result={result} selectedSpecies={selectedSpecies} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
