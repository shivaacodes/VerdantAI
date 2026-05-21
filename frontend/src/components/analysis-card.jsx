"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Activity, Droplets, Sun, CheckCircle, AlertTriangle, XOctagon } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AnalysisCard({ result, isScanning }) {
  const getProcessedImageUrl = () => {
    const file = result?.result?.processed_file;
    if (!file) return "";
    if (file.startsWith("http://") || file.startsWith("https://")) {
      return file;
    }
    return `${API_BASE_URL}/api/processed/${file}`;
  };

  const imageUrl = getProcessedImageUrl();

  // Helper to determine health status metrics based on Hue
  const getHealthStatus = (hue) => {
    if (hue === undefined || hue === null) return null;
    const h = Number(hue);
    if (h >= 35 && h <= 85) {
      return {
        label: "Optimal Health",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        dotColor: "bg-emerald-400",
        icon: <CheckCircle size={12} className="text-emerald-400" />,
        desc: "High chloroplastic density. Strong photosynthetic activity."
      };
    } else if ((h >= 20 && h < 35) || (h > 85 && h <= 105)) {
      return {
        label: "Mild Stress Alert",
        color: "text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        dotColor: "bg-amber-400",
        icon: <AlertTriangle size={12} className="text-amber-400" />,
        desc: "Minor chlorophyll degradation. Monitor environmental stress."
      };
    } else {
      return {
        label: "Critical Care",
        color: "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        dotColor: "bg-rose-400",
        icon: <XOctagon size={12} className="text-rose-400" />,
        desc: "Severe chlorosis or foliar damage. Intervention highly recommended."
      };
    }
  };

  const hue = result?.result?.hue;
  const saturation = result?.result?.saturation;
  const value = result?.result?.value;
  const health = getHealthStatus(hue);

  // SVG Circular Gauge helper
  const CircularGauge = ({ value, max, label, colorClass, icon }) => {
    const radius = 22;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center p-2 rounded-2xl bg-white/[0.01] border border-white/5 flex-1 relative group hover:border-white/10 transition-all duration-300">
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Value circle */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`gauge-ring-circle ${colorClass}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            {icon}
            <span className="text-[10px] font-bold text-gray-200 mt-0.5">{Math.round(value)}</span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-2 group-hover:text-gray-200 transition">
          {label}
        </span>
        <span className="text-[8px] text-gray-500 mt-0.5 font-mono">
          max {max}
        </span>
      </div>
    );
  };

  return (
    <Card className="glass-panel border border-white/5 rounded-3xl h-full flex flex-col justify-between overflow-hidden shadow-2xl relative z-10 transition-all duration-300">
      <CardContent className="p-6 flex flex-col h-full justify-between space-y-4">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                Diagnostics HUD
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">Spectral Analysis Outcome</p>
            </div>
          </div>
          {result && !result.error && !isScanning && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${health?.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${health?.dotColor} animate-pulse`} />
              {health?.label}
            </div>
          )}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-16 h-16 mb-4">
                <span className="absolute inset-0 rounded-full border-2 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                <span className="absolute inset-2 rounded-full border-2 border-teal-500/5 border-b-teal-400 animate-spin [animation-direction:reverse]" />
                <div className="absolute inset-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Activity size={18} className="animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold animate-pulse">
                Decomposing Pixels...
              </span>
              <p className="text-[9px] text-gray-500 mt-1 max-w-[200px]">
                OpenCV is running pixel segmentation and extracting spectral channels.
              </p>
            </div>
          ) : result ? (
            result.error ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                <span className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3">
                  <AlertTriangle size={20} />
                </span>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  Analysis Failure
                </h4>
                <p className="text-[10px] text-gray-500 max-w-[220px]">
                  {result.error}
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col justify-between h-full space-y-4">
                {/* Processed Leaf Specimen Image */}
                <div className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-white/10 group shadow-inner">
                  <img
                    src={imageUrl}
                    alt="Processed leaf diagnostics"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Image Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Status Overlay description */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-8">
                    <p className="text-[9px] text-gray-400 font-mono flex items-center gap-1 leading-normal">
                      {health?.icon}
                      <span className="truncate">{health?.desc}</span>
                    </p>
                  </div>
                </div>

                {/* Circular Gauges */}
                <div className="flex gap-2">
                  <CircularGauge
                    value={hue ?? 0}
                    max={179}
                    label="Chlorophyll"
                    colorClass="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]"
                    icon={<Shield size={10} className="text-emerald-400" />}
                  />
                  <CircularGauge
                    value={saturation ?? 0}
                    max={255}
                    label="Hydration"
                    colorClass="text-teal-400 drop-shadow-[0_0_6px_rgba(45,212,191,0.3)]"
                    icon={<Droplets size={10} className="text-teal-400" />}
                  />
                  <CircularGauge
                    value={value ?? 0}
                    max={255}
                    label="Luminosity"
                    colorClass="text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]"
                    icon={<Sun size={10} className="text-amber-400" />}
                  />
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center border border-white/[0.02] bg-white/[0.005] rounded-2xl w-full h-[220px]">
              <div className="relative w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-600 mb-4 bg-white/[0.01]">
                <Activity size={20} className="opacity-40" />
              </div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Diagnostic Console Idle
              </h4>
              <p className="text-[10px] text-gray-600 max-w-[200px]">
                Awaiting specimen capture payload to initiate spectral analysis.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
