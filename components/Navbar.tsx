"use client";

import React, { useState, useEffect } from "react";
import { Shield, BookOpen, MessageSquare, Sun, Moon, GraduationCap } from "lucide-react";

interface NavbarProps {
  onOpenEducation: () => void;
  onOpenGuide: () => void;
  onOpenContact: () => void;
}

export default function Navbar({
  onOpenEducation,
  onOpenGuide,
  onOpenContact,
}: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDark = document.documentElement.classList.contains("dark");
    setIsDark(hasDark);
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (isCurrentlyDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    }
  };

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-40 w-full border-b bg-white/95 border-slate-200 dark:bg-slate-950/95 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl border bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/50 dark:border-blue-800/60 dark:text-blue-400">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm sm:text-base text-slate-900 dark:text-white">
              URL Security Checker
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50">
              v1.0
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span>API Online</span>
          </div>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-medium border rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700/70 dark:text-slate-200"
            title={mounted ? (isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)") : "Ubah Tema Tampilan"}
            aria-label="Toggle dark mode"
          >
            {mounted ? (
              isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Gelap</span>
                </>
              )
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline">Gelap</span>
              </>
            )}
          </button>

          {/* Education Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onOpenEducation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold border rounded-xl bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:border-purple-800/60 dark:text-purple-300 transition-colors shadow-xs"
            title="Buka panduan edukasi literasi keamanan tautan"
          >
            <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Edukasi</span>
          </button>

          {/* Guide Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium border rounded-xl bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700/70 dark:text-slate-300 transition-colors"
            title="Buka panduan cara menggunakan aplikasi"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* Contact / Help Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            title="Hubungi bantuan atau laporkan masalah"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Bantuan &amp; Kontak</span>
            <span className="md:hidden">Kontak</span>
          </button>
        </div>
      </div>
    </header>
  );
}
