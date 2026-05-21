"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07090e] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 mb-8 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sparkles size={16} />
              </span>
              <span className="text-xl font-black font-urbanist text-white tracking-tight">
                Verdant<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              VerdantAI is an advanced foliar diagnostic platform powered by OpenCV spectral segmentation and Gemini Multimodal LLM analysis. Specially built as a recruiter-grade SaaS showcase.
            </p>
          </div>

          {/* Technology Badges */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Platform Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Tailwind 3.4", "Flask Core", "OpenCV Engine", "Gemini 1.5", "jsPDF"].map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 bg-white/[0.02] border border-white/5 rounded-md text-[9px] text-gray-400 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
          <div>
            <span>Developed and Maintained by </span>
            <span className="font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer">
              Shiva Sajay
            </span>
          </div>
          <div>
            © {new Date().getFullYear()} VerdantAI. Specially built for recruiter assessment review.
          </div>
        </div>
      </div>
    </footer>
  );
}
