import type { Metadata } from "next";
import { Poppins, Urbanist } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VerdantAI - The Intelligent Multimodal Plant Care Suite",
  description: "Map plant health, diagnose stress patterns, and generate botanical prescriptions using advanced computer vision and multimodal AI.",
  keywords: [
    "Next.js",
    "React",
    "Flask",
    "OpenCV",
    "Plant Diagnostics",
    "SaaS",
    "AI Crop Analysis",
    "Chlorophyll Analysis",
    "Botanical AI"
  ],
  authors: [{ name: "VerdantAI Team", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "VerdantAI - The Intelligent Plant Care Suite",
    description: "Map plant health and diagnose stress patterns instantly with computer vision and AI.",
    url: "https://verdantai.com",
    siteName: "VerdantAI",
    images: [
      {
        url: "/images/chloromap.png",
        width: 1200,
        height: 630,
        alt: "VerdantAI Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${poppins.variable} ${urbanist.variable} font-urbanist antialiased flex flex-col min-h-screen text-gray-100 bg-[#0b0f17]`}
      >
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
