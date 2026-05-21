"use client";

import { useEffect, useState } from "react";
import { Camera, Cpu, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function useElementOnScreen(options) {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isVisible];
}

export default function FeatureSection() {
  const features = [
    {
      id: 1,
      title: "1. Capture & Upload",
      desc: "Upload or drag in a high-res photo of any leaf. Our upload portal isolates boundaries and preprocesses color profiles instantly.",
      icon: Camera,
      badge: "OpenCV BOUNDS"
    },
    {
      id: 2,
      title: "2. Multimodal Fusion Scan",
      desc: "Our OpenCV core mapping measures Hue-Saturation-Value vectors while Google Gemini Vision scans qualitative leaf blemishes.",
      icon: Cpu,
      badge: "GEMINI 1.5 PRO"
    },
    {
      id: 3,
      title: "3. Actionable Caresheets",
      desc: "Receive structured foliar insights, leaf hydration status, qualitative stress diagnosis, and a certificate-grade PDF report.",
      icon: FileText,
      badge: "PDF CERTIFICATE"
    },
  ];

  const [ref, isVisible] = useElementOnScreen({
    rootMargin: "0px",
    threshold: 0.15,
  });

  return (
    <section id="features" className="py-24 bg-[#07090e] border-y border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
            SYSTEM PIPELINE
          </span>
          <h2 className="text-4xl sm:text-5xl font-black font-urbanist text-white mt-6 mb-4">
            How VerdantAI Diagnoses Leaf Stress
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
            Deploy scientific plant diagnostics in three automated phases.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch"
        >
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`glass-panel glass-panel-hover p-8 rounded-3xl flex flex-col justify-between transition-all duration-700 ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
            >
              <div>
                {/* Feature Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <feature.icon size={26} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-md">
                    {feature.badge}
                  </span>
                </div>

                {/* Feature Content */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-urbanist">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-urbanist">
                  {feature.desc}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Fully Automated Phase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
