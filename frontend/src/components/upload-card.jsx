"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UploadCloud, Trash2, RefreshCw, Play, Cpu } from "lucide-react";

export default function UploadCard({
  selectedImage,
  setSelectedImage,
  handleImageUpload,
  handleAnalyze,
  selectedSpecies,
  setSelectedSpecies,
  plantSpeciesList,
  isScanning,
  scanStepText,
  scanProgress,
}) {
  const fileInputRef = useRef(null);

  const triggerFileSelect = () => {
    if (isScanning) return;
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-panel border border-white/5 rounded-3xl h-full flex flex-col justify-between overflow-hidden shadow-2xl relative z-10 transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full justify-between space-y-4">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Cpu size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                Foliar Capture
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">Multimodal Diagnostic Target</p>
            </div>
          </div>
          {selectedImage && !isScanning && (
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
              title="Remove Leaf"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
          {selectedImage ? (
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-white/10 group shadow-inner">
              <img
                src={selectedImage.preview}
                alt="Plant specimen"
                className="object-cover w-full h-full"
              />

              {/* Scanning HUD Overlay */}
              {isScanning && (
                <>
                  <div className="scanner-overlay" />
                  <div className="scanner-line" />
                  
                  {/* Glowing HUD Tech corners */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  
                  {/* Status Indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[2px] p-4 text-center">
                    <motion.div 
                      className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mb-4" 
                    />
                    <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse mb-1">
                      ANALYSIS RUNNING
                    </span>
                    <p className="text-[11px] text-gray-300 font-medium max-w-[200px] h-8 truncate">
                      {scanStepText || "Analyzing plant specimen..."}
                    </p>
                    
                    {/* Linear Progress Bar */}
                    <div className="w-[160px] bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                      <motion.div 
                        className="bg-emerald-400 h-full"
                        style={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 font-mono">{scanProgress}% COMPLETE</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div 
              onClick={triggerFileSelect}
              className="w-full h-[220px] rounded-2xl border border-dashed border-white/10 hover:border-emerald-500/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={24} />
              </div>
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Drag & Drop Specimen
              </h4>
              <p className="text-[10px] text-gray-500 max-w-[180px] mb-3">
                Upload a clear leaf image for precise botanical diagnostics
              </p>
              <span className="px-3 py-1 bg-white/5 group-hover:bg-emerald-500/10 border border-white/10 group-hover:border-emerald-500/20 rounded-lg text-[9px] text-gray-400 group-hover:text-emerald-400 font-bold transition-all uppercase tracking-wider">
                Browse Files
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isScanning}
          />
        </div>

        {/* Interactive Species Selector & Controls */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1.5">
              Select Specimen Species
            </label>
            <div className="relative">
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                disabled={isScanning}
                className="w-full bg-[#0d121b] border border-white/10 hover:border-white/20 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none appearance-none transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {plantSpeciesList.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {selectedImage ? (
              <>
                <Button
                  onClick={handleAnalyze}
                  disabled={isScanning || !selectedImage}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400/20 text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300"
                >
                  <Play size={12} className="fill-current" />
                  Run Diagnostics
                </Button>
                
                <Button
                  onClick={triggerFileSelect}
                  disabled={isScanning}
                  className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-gray-200 rounded-xl transition"
                  title="Change Specimen"
                >
                  <RefreshCw size={12} className={isScanning ? "animate-spin" : ""} />
                </Button>
              </>
            ) : (
              <Button
                onClick={triggerFileSelect}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition duration-300"
              >
                <UploadCloud size={14} />
                Capture Plant Leaf
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
