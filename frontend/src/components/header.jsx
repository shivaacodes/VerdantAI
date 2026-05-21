"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, ShieldCheck, ArrowLeft } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isConsole = pathname === "/console";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = isConsole
    ? [
        { label: "Features", href: "/#features" },
        { label: "About", href: "/#about" },
      ]
    : [
        { label: "Features", href: "#features" },
        { label: "Console", href: "/console" },
        { label: "About", href: "#about" },
      ];

  return (
    <header 
      className={`w-full py-5 px-6 sm:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#0b0f17]/75 backdrop-blur-lg border-b border-white/5 py-4" 
          : "bg-transparent py-6"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <Link
          href="/"
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight font-urbanist hover:opacity-90 transition-opacity"
        >
          Verdant<span className="text-white font-medium">AI</span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">
          <ShieldCheck size={11} /> SaaS Demo
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-semibold text-gray-300 hover:text-emerald-400 transition-colors relative group py-1"
          >
            {item.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </nav>

      {/* Action CTA Button */}
      <div className="hidden md:flex items-center gap-4">
        {isConsole ? (
          <Link 
            href="/" 
            className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white glass-panel hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 flex items-center gap-1.5"
          >
            <ArrowLeft size={14} className="text-emerald-400" /> Back to Home
          </Link>
        ) : (
          <Link 
            href="/console" 
            className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-200"
          >
            Launch Console
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl py-6 px-8 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold text-gray-200 hover:text-emerald-400 py-2 border-b border-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isConsole ? (
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full text-center py-3 text-base font-bold text-gray-200 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} className="text-emerald-400" /> Back to Home
            </Link>
          ) : (
            <Link 
              href="/console"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full text-center py-3 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl"
            >
              Launch Console
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
