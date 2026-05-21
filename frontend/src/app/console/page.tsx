import Header from "@/components/header";
import AnalyzeSection from "@/components/analyze-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console | VerdantAI - Intelligent Plant Suite",
  description: "Deploy precision OpenCV foliar target contours and Gemini 1.5 multimodal AI sweeps on plant specimens in real-time.",
};

export default function ConsolePage() {
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col justify-between">
      <Header />
      <main className="flex-grow pt-10">
        <AnalyzeSection />
      </main>
    </div>
  );
}
