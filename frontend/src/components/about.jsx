import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf, Info } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="flex flex-col items-center justify-center px-6 py-24 bg-[#07090e] border-t border-white/5 text-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
        <Info size={13} /> Our Mission
      </span>

      <h2 className="text-4xl sm:text-5xl font-black text-white font-urbanist mb-6">
        Built to understand plants, not just photograph them.
      </h2>
      <p className="mt-2 text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed font-urbanist">
        VerdantAI started as a side project to see how far OpenCV and a multimodal model could go in diagnosing plant health from just a photo. It combines pixel-level color analysis with AI-generated care plans, tailored by species.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
        <Link
          href="https://shivasajay.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button className="w-full px-8 py-4 text-base font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-200 text-white">
            Learn More
          </Button>
        </Link>
        <Link
          href="https://x.com/shiv4real"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            className="w-full px-8 py-4 text-base font-bold rounded-2xl border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-200"
          >
            Get in Touch
          </Button>
        </Link>
      </div>
    </section>
  );
}
