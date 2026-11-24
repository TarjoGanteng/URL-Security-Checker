"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { SafeBrowsingResult } from "@/lib/types";

interface SafeBrowsingResultProps {
  result: SafeBrowsingResult;
  onAnalyzeDeep: () => void;
  isAnalyzing: boolean;
}

export default function SafeBrowsingResultCard({
  result,
  onAnalyzeDeep,
  isAnalyzing,
}: SafeBrowsingResultProps) {
  if (result.safe) {
    return (
      <div className="animate-slide-up space-y-4">
        {/* Safe Card */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:bg-emerald-950/30 dark:border-emerald-800/60">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                ✅ URL Aman
              </h3>
              <p className="text-sm text-emerald-900/70 dark:text-emerald-200/80 mb-2">
                Google Safe Browsing tidak mendeteksi ancaman pada URL ini.
              </p>
              {/* URL display — plain text */}
              <div className="bg-white border border-emerald-200/80 rounded-lg px-3 py-2 mt-2 shadow-xs dark:bg-slate-900/80 dark:border-emerald-800/50">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">URL yang diperiksa:</p>
                <span className="text-sm font-mono text-slate-800 dark:text-slate-200 font-medium break-all select-all">
                  {result.checkedUrl}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Analysis Button */}
        <DeepAnalysisButton onAnalyzeDeep={onAnalyzeDeep} isAnalyzing={isAnalyzing} />
      </div>
    );
  }

  return (
    <div className="animate-slide-up space-y-4">
      {/* Dangerous Card */}
      <div className="rounded-xl border border-red-200 bg-red-50/90 p-5 shadow-sm dark:bg-red-950/40 dark:border-red-800/60">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-red-100 p-2.5 text-red-600 dark:bg-red-900/60 dark:text-red-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">
              ⛔ URL Berbahaya!
            </h3>
            <p className="text-sm text-red-900/80 dark:text-red-200/80 mb-3">
              Google Safe Browsing mendeteksi ancaman pada URL ini. Sangat
              disarankan untuk tidak mengunjungi tautan ini.
            </p>

            {/* URL display */}
            <div className="bg-white border border-red-200 rounded-lg px-3 py-2 mb-3 shadow-xs dark:bg-slate-900/80 dark:border-red-800/50">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">URL yang diperiksa:</p>
              <span className="text-sm font-mono text-red-700 dark:text-red-400 font-semibold break-all select-all">
                {result.checkedUrl}
              </span>
            </div>

            {/* Threat badges */}
            {result.threats.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide">
                  Jenis Ancaman Terdeteksi:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.threats.map((threat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 shadow-xs dark:bg-red-900/60 dark:text-red-200 dark:border-red-700"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {threat.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning notice */}
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 shadow-xs dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Peringatan:</strong> Jangan klik atau bagikan URL ini kepada siapapun.
          URL ini telah dilaporkan sebagai berbahaya oleh Google Safe Browsing.
        </span>
      </div>

      {/* Deep Analysis Button */}
      <DeepAnalysisButton onAnalyzeDeep={onAnalyzeDeep} isAnalyzing={isAnalyzing} />
    </div>
  );
}

function DeepAnalysisButton({
  onAnalyzeDeep,
  isAnalyzing,
}: {
  onAnalyzeDeep: () => void;
  isAnalyzing: boolean;
}) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={onAnalyzeDeep}
      disabled={isAnalyzing}
      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm"
    >
      {isAnalyzing ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-blue-600" />
          <span>Menganalisis dengan 70+ Vendor Keamanan...</span>
        </>
      ) : (
        <>
          <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Lakukan Analisis Mendalam (VirusTotal)</span>
        </>
      )}
    </button>
  );
}
