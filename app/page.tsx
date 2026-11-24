"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Shield, AlertCircle, RefreshCw, Eye, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import GuideModal from "@/components/GuideModal";
import ContactModal from "@/components/ContactModal";
import UrlForm from "@/components/UrlForm";
import SafeBrowsingResultCard from "@/components/SafeBrowsingResult";
import VirusTotalResultCard from "@/components/VirusTotalResult";
import VisualSandboxResult from "@/components/VisualSandboxResult";
import HistoryPanel from "@/components/HistoryPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  SafeBrowsingResult,
  VirusTotalResult,
  TraceUrlResult,
  CheckHistoryItem,
} from "@/lib/types";

const HISTORY_KEY = "url_checker_history";
const MAX_HISTORY = 5;

function loadHistory(): CheckHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as CheckHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: CheckHistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export default function HomePage() {
  // State
  const [sbLoading, setSbLoading] = useState(false);
  const [vtLoading, setVtLoading] = useState(false);
  const [traceLoading, setTraceLoading] = useState(false);
  const [sbResult, setSbResult] = useState<SafeBrowsingResult | null>(null);
  const [vtResult, setVtResult] = useState<VirusTotalResult | null>(null);
  const [traceResult, setTraceResult] = useState<TraceUrlResult | null>(null);
  const [sbError, setSbError] = useState<string | null>(null);
  const [vtError, setVtError] = useState<string | null>(null);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<CheckHistoryItem[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Add to history
  const addToHistory = useCallback(
    (url: string, result: SafeBrowsingResult) => {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.url !== url);
        const newItem: CheckHistoryItem = {
          url,
          checkedAt: new Date().toISOString(),
          safeBrowsingStatus: result.safe ? "safe" : "dangerous",
          threatTypes: result.threats.map((t) => t.label),
        };
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  // Check URL: Google Safe Browsing + Trace Redirects & Sandbox
  const handleCheckUrl = useCallback(
    async (url: string) => {
      setSbLoading(true);
      setTraceLoading(true);
      setSbResult(null);
      setTraceResult(null);
      setSbError(null);
      setTraceError(null);
      setVtResult(null);
      setVtError(null);
      setCurrentUrl(url);

      // 1. Google Safe Browsing
      const safeBrowsingPromise = (async () => {
        try {
          const response = await fetch("/api/check-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            setSbError(data.error || "Gagal memeriksa URL. Silakan coba lagi.");
            return;
          }
          const result = data.result as SafeBrowsingResult;
          setSbResult(result);
          addToHistory(url, result);
        } catch (err) {
          console.error("Safe Browsing fetch error:", err);
          setSbError("Koneksi gagal. Periksa jaringan Anda dan coba lagi.");
        } finally {
          setSbLoading(false);
        }
      })();

      // 2. Trace Redirect Chain & Visual Sandbox
      const tracePromise = (async () => {
        try {
          const response = await fetch("/api/trace-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            setTraceError(data.error || "Gagal melacak pengalihan tautan.");
            return;
          }
          setTraceResult(data.result as TraceUrlResult);
        } catch (err) {
          console.error("Trace URL fetch error:", err);
          setTraceError("Gagal menelusuri pengalihan tautan.");
        } finally {
          setTraceLoading(false);
        }
      })();

      await Promise.allSettled([safeBrowsingPromise, tracePromise]);
    },
    [addToHistory]
  );

  // Stage 2: Deep analysis with VirusTotal
  const handleVirusTotalAnalysis = useCallback(async () => {
    if (!currentUrl) return;
    setVtLoading(true);
    setVtResult(null);
    setVtError(null);
    try {
      const response = await fetch("/api/virustotal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentUrl }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setVtError(data.error || "Gagal mengambil data VirusTotal.");
        return;
      }
      setVtResult(data.result as VirusTotalResult);
    } catch (err) {
      console.error("VirusTotal fetch error:", err);
      setVtError("Koneksi gagal. Periksa jaringan Anda dan coba lagi.");
    } finally {
      setVtLoading(false);
    }
  }, [currentUrl]);

  const handleSelectFromHistory = useCallback(
    (url: string) => {
      handleCheckUrl(url);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [handleCheckUrl]
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Navigation Header */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-3 bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-800/50 dark:text-blue-400">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight text-slate-900 dark:text-white">
            URL Security Checker
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Periksa keamanan tautan secara menyeluruh sebelum mengkliknya. Dilengkapi deteksi
            ancaman instan, pratinjau visual terisolasi, dan analisis 70+ vendor keamanan dunia.
          </p>

          {/* Powered-by badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Google Safe Browsing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              VirusTotal (70+ Vendors)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border bg-white border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              Visual Sandbox &amp; Redirect Tracer
            </span>
          </div>
        </header>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-6 space-y-6">
            {/* Input Form Card */}
            <div className="border rounded-2xl p-6 sm:p-7 bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-slate-200">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Pemeriksaan Tautan
              </h2>
              <UrlForm onSubmit={handleCheckUrl} isLoading={sbLoading || traceLoading} />

              {/* Stage 1 Loading */}
              {sbLoading && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <LoadingSpinner size="md" text="Memeriksa dengan Google Safe Browsing..." />
                </div>
              )}

              {/* Stage 1 Error */}
              {sbError && !sbLoading && (
                <div className="mt-6 animate-fade-in flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-700/50 dark:bg-red-900/20">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 dark:text-red-300">{sbError}</p>
                    <button
                      type="button"
                      onClick={() => currentUrl && handleCheckUrl(currentUrl)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Coba lagi
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 1 Result */}
              {sbResult && !sbLoading && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Tahap 1: Google Safe Browsing
                    </span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <SafeBrowsingResultCard
                    result={sbResult}
                    onAnalyzeDeep={handleVirusTotalAnalysis}
                    isAnalyzing={vtLoading}
                  />
                </div>
              )}
            </div>

            {/* Stage 2 Loading (VirusTotal) */}
            {vtLoading && (
              <div className="border rounded-2xl p-6 bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <LoadingSpinner size="md" text="Menganalisis dengan VirusTotal (70+ vendor keamanan)..." />
              </div>
            )}

            {/* Stage 2 Error */}
            {vtError && !vtLoading && (
              <div className="animate-fade-in flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-700/50 dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 dark:text-red-300">{vtError}</p>
                  <button
                    type="button"
                    onClick={handleVirusTotalAnalysis}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Coba lagi
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2 Result (VirusTotal) */}
            {vtResult && !vtLoading && (
              <div className="border rounded-2xl p-6 bg-white border-slate-200 shadow-sm text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Tahap 2: Hasil Analisis VirusTotal
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                <VirusTotalResultCard
                  result={vtResult}
                  onReanalyze={handleVirusTotalAnalysis}
                  isReanalyzing={vtLoading}
                />
              </div>
            )}

            {/* History Panel */}
            <HistoryPanel
              history={history}
              onSelectUrl={handleSelectFromHistory}
              onClear={handleClearHistory}
            />
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="lg:col-span-6 space-y-6">
            {/* Loading trace */}
            {traceLoading && (
              <div className="border rounded-2xl p-6 bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <LoadingSpinner size="md" text="Melacak alur pengalihan (redirect chain) & mengambil tangkapan layar aman..." />
              </div>
            )}

            {/* Trace result */}
            {traceResult && !traceLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                    Inspeksi Visual &amp; Rantai Pengalihan
                  </span>
                </div>
                <VisualSandboxResult trace={traceResult} />
              </div>
            )}

            {/* Trace error */}
            {traceError && !traceLoading && (
              <div className="animate-fade-in flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-700/50 dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{traceError}</p>
              </div>
            )}

            {/* Initial Empty State / Feature Highlights */}
            {!traceResult && !traceLoading && (
              <div className="border rounded-2xl p-6 sm:p-7 space-y-5 bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-2 font-semibold text-base pb-3 border-b text-slate-900 border-slate-100 dark:text-slate-300 dark:border-slate-800">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Fitur Keamanan URL Terintegrasi</span>
                </div>

                <div className="space-y-4 text-sm">
                  {[
                    {
                      num: "01",
                      badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                      title: "Tahap 1: Google Safe Browsing",
                      desc: "Pengecekan kilat terhadap miliaran URL berbahaya yang terdaftar pada database keamanan Google (Phishing, Malware, Unwanted Software).",
                    },
                    {
                      num: "02",
                      badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
                      title: "Pratinjau Visual & Pelacak Pengalihan",
                      desc: "Melihat tampilan asli situs web di sandbox cloud tanpa membuka browser Anda, serta melacak setiap lompatan URL (shortlink / cloaking pancingan).",
                    },
                    {
                      num: "03",
                      badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
                      title: "Tahap 2: Analisis Mendalam VirusTotal",
                      desc: "Analisis multi-engine dari 70+ vendor keamanan siber dunia (Kaspersky, Bitdefender, ESET, Fortinet, dll) lengkap dengan rincian vendor.",
                    },
                  ].map((f) => (
                    <div
                      key={f.num}
                      className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 text-slate-700 dark:bg-slate-800/40 dark:border-slate-700/40 dark:text-slate-400"
                    >
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 font-bold text-xs ${f.badgeBg}`}>
                        {f.num}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-0.5 text-slate-900 dark:text-slate-200">
                          {f.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl text-xs flex items-center gap-2 border bg-blue-50/70 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-700/30 dark:text-blue-300">
                  <Shield className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Semua link ditampilkan sebagai teks murni untuk melindungi perangkat Anda dari klik tidak sengaja.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-slate-700 dark:hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Panduan Penggunaan
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsContactOpen(true)}
              className="hover:text-slate-700 dark:hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              Bantuan &amp; Kontak Dukungan
            </button>
          </div>
          <p className="text-slate-400 dark:text-slate-600">
            Dibuat dengan Next.js (App Router), Tailwind CSS &amp; Lucide React. Siap di-deploy ke Vercel.
          </p>
          <p className="text-slate-400 dark:text-slate-600">
            Gunakan untuk tujuan analisis keamanan yang sah.
          </p>
        </footer>
      </main>

      {/* Interactive Modals */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
