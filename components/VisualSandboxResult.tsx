"use client";

import React, { useState } from "react";
import {
  Eye,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  Server,
  Layers,
  Lock,
  Unlock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { TraceUrlResult } from "@/lib/types";

interface VisualSandboxResultProps {
  trace: TraceUrlResult;
}

export default function VisualSandboxResult({
  trace,
}: VisualSandboxResultProps) {
  const screenshotEndpoint = `/api/screenshot?url=${encodeURIComponent(
    trace.finalUrl
  )}`;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(0);

  let hostname = trace.finalUrl;
  try {
    hostname = new URL(trace.finalUrl).hostname;
  } catch {
    // ignore
  }

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  // Fallback timer if image doesn't load within 5.5s
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsTimedOut(false);

    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 5500);

    return () => clearTimeout(timer);
  }, [trace.finalUrl, cacheBuster]);

  const handleRetry = () => {
    setImageLoaded(false);
    setImageError(false);
    setIsTimedOut(false);
    setCacheBuster(Date.now());
  };

  return (
    <div className="animate-slide-up space-y-5">
      {/* 1. Sandboxed Browser Mockup (Visual Screenshot) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
        {/* Browser Top Bar Mockup */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 dark:bg-slate-800/80 dark:border-slate-700/60">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          {/* Fake Address Bar */}
          <div className="flex-1 max-w-lg mx-auto bg-white border border-slate-300 rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-mono text-slate-800 shadow-2xs truncate dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200">
            {trace.finalUrl.startsWith("https://") ? (
              <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Unlock className="h-3 w-3 text-red-500 flex-shrink-0" />
            )}
            <span className="truncate select-all font-medium">{trace.finalUrl}</span>
          </div>

          {/* Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50">
            <Eye className="h-3 w-3" />
            <span>Sandbox Preview</span>
          </div>
        </div>

        {/* Screenshot View Area */}
        <div className="relative bg-slate-50 min-h-[260px] sm:min-h-[320px] flex items-center justify-center p-3 sm:p-5 dark:bg-slate-950">
          {/* Loading State */}
          {!imageLoaded && !imageError && !isTimedOut && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90 dark:bg-slate-950/90 z-10 px-4 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Mengambil tangkapan layar aman di sandbox cloud...
              </p>
            </div>
          )}

          {/* Fallback Card if Timed Out or Error */}
          {(imageError || (isTimedOut && !imageLoaded)) ? (
            <div className="w-full flex flex-col items-center justify-center py-6 px-4 text-center max-w-md bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              {/* Favicon */}
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 p-3 flex items-center justify-center shadow-xs dark:bg-slate-800 dark:border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={faviconUrl}
                  alt={hostname}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {hostname}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Pratinjau visual membutuhkan waktu lebih lama untuk situs ini (proteksi bot/CORS pada CDN pratinjau).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-slate-300 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Muat Ulang Screenshot
                </button>
              </div>
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`${trace.finalUrl}-${cacheBuster}`}
              src={`${screenshotEndpoint}&t=${cacheBuster}`}
              alt={`Tangkapan layar sandbox untuk ${trace.finalUrl}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`max-w-full rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 object-contain max-h-[420px] transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Browser Mockup Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Tampilan terisolasi aman: script atau malware di situs ini tidak dieksekusi di browser Anda.
          </span>
        </div>
      </div>

      {/* 2. Redirect Chain Trace Analysis */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold">
              Rantai Pengalihan Tautan (Redirect Chain)
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              trace.hasRedirects
                ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
            }`}
          >
            {trace.hasRedirects
              ? `${trace.totalRedirects}x Pengalihan`
              : "Tautan Langsung"}
          </span>
        </div>

        {/* Redirect steps list */}
        {trace.hops && trace.hops.length > 0 && (
          <div className="space-y-3">
            {trace.hops.map((step, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === trace.hops.length - 1;

              return (
                <div key={idx} className="relative flex items-start gap-3">
                  {/* Step indicator node */}
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        isFirst
                          ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/60 dark:border-blue-700 dark:text-blue-300"
                          : isLast
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/60 dark:border-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-7 bg-slate-200 dark:bg-slate-700 my-1" />
                    )}
                  </div>

                  {/* Step detail card */}
                  <div className="flex-1 min-w-0 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs dark:bg-slate-800/50 dark:border-slate-700/60">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isFirst
                          ? "URL Awal"
                          : isLast
                          ? "URL Tujuan Akhir (Landing Page)"
                          : `Lompatan #${idx}`}
                      </span>
                      {step.statusCode && (
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            step.statusCode >= 300 && step.statusCode < 400
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                              : step.statusCode === 200
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          HTTP {step.statusCode}
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-slate-800 dark:text-slate-200 break-all select-all font-medium">
                      {step.url}
                    </p>

                    {step.statusText && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span>Pengalihan ke tujuan berikutnya ({step.statusText})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Server & Tech headers metadata */}
        {trace.serverHeaders && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            {trace.serverHeaders.server && (
              <span className="flex items-center gap-1">
                <Server className="h-3.5 w-3.5 text-slate-400" />
                Server:{" "}
                <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                  {trace.serverHeaders.server}
                </span>
              </span>
            )}
            {trace.serverHeaders.contentType && (
              <span>
                Content-Type:{" "}
                <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">
                  {trace.serverHeaders.contentType.split(";")[0]}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
