"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VirusTotalResult, VirusTotalEngineResult, FEATURED_VENDORS } from "@/lib/types";

interface VirusTotalResultProps {
  result: VirusTotalResult;
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return "-";
  return new Date(timestamp * 1000).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ScoreBar({
  stats,
}: {
  stats: { harmless: number; malicious: number; suspicious: number; undetected: number; timeout: number };
}) {
  const total =
    stats.harmless +
    stats.malicious +
    stats.suspicious +
    stats.undetected +
    stats.timeout;

  if (total === 0) return null;

  const harmlessPct = Math.round((stats.harmless / total) * 100);
  const maliciousPct = Math.round((stats.malicious / total) * 100);
  const suspiciousPct = Math.round((stats.suspicious / total) * 100);
  const undetectedPct = Math.round((stats.undetected / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
        {maliciousPct > 0 && (
          <div
            style={{ width: `${maliciousPct}%` }}
            className="bg-red-500 transition-all duration-500"
            title={`Malicious: ${stats.malicious}`}
          />
        )}
        {suspiciousPct > 0 && (
          <div
            style={{ width: `${suspiciousPct}%` }}
            className="bg-amber-400 transition-all duration-500"
            title={`Suspicious: ${stats.suspicious}`}
          />
        )}
        {harmlessPct > 0 && (
          <div
            style={{ width: `${harmlessPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Harmless: ${stats.harmless}`}
          />
        )}
        {undetectedPct > 0 && (
          <div
            style={{ width: `${undetectedPct}%` }}
            className="bg-slate-300 dark:bg-slate-600 transition-all duration-500"
            title={`Undetected: ${stats.undetected}`}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Aman: {stats.harmless}
        </span>
        {stats.malicious > 0 && (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            Berbahaya: {stats.malicious}
          </span>
        )}
        {stats.suspicious > 0 && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Mencurigakan: {stats.suspicious}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
          Tidak Terdeteksi: {stats.undetected}
        </span>
      </div>
    </div>
  );
}

function VendorResultBadge({
  result,
}: {
  result: VirusTotalEngineResult;
}) {
  const { category } = result;

  if (category === "malicious") {
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/60 dark:text-red-300 dark:border-red-700">
        Berbahaya ({result.result || "Malware"})
      </span>
    );
  }
  if (category === "suspicious") {
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700">
        Mencurigakan
      </span>
    );
  }
  if (category === "harmless") {
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
        Bersih
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-md text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
      Tidak Terdeteksi
    </span>
  );
}

export default function VirusTotalResultCard({
  result,
}: VirusTotalResultProps) {
  const [showAllVendors, setShowAllVendors] = useState(false);

  if (!result.data?.attributes) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm">
        {result.message || "Data analisis VirusTotal belum tersedia atau sedang diproses."}
      </div>
    );
  }

  const { attributes } = result.data;
  const stats = attributes.last_analysis_stats;
  const analysisResults = attributes.last_analysis_results || {};

  const isMalicious = stats.malicious > 0;
  const isSuspicious = stats.suspicious > 0 && !isMalicious;
  const totalEngines =
    stats.harmless +
    stats.malicious +
    stats.suspicious +
    stats.undetected +
    stats.timeout;
  const totalDetections = stats.malicious + stats.suspicious;

  const featuredResults = FEATURED_VENDORS.map((v) => {
    const key = Object.keys(analysisResults).find(
      (k) => k.toLowerCase() === v.toLowerCase()
    );
    return key ? { vendor: key, result: analysisResults[key] } : null;
  }).filter((item): item is { vendor: string; result: VirusTotalEngineResult } => item !== null);

  const allVendorEntries: [string, VirusTotalEngineResult][] = Object.entries(analysisResults).sort(
    ([, a], [, b]) => {
      const order: Record<string, number> = {
        malicious: 0,
        suspicious: 1,
        harmless: 2,
        undetected: 3,
      };
      return (order[a.category] ?? 4) - (order[b.category] ?? 4);
    }
  );

  const displayedVendors = showAllVendors
    ? allVendorEntries
    : allVendorEntries.slice(0, 15);

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Overview Banner */}
      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isMalicious
            ? "border-red-200 bg-red-50/80 dark:bg-red-950/30 dark:border-red-800/60"
            : isSuspicious
            ? "border-amber-200 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-800/60"
            : "border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-800/60"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              isMalicious
                ? "bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-400"
                : isSuspicious
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400"
            }`}
          >
            {isMalicious ? (
              <ShieldAlert className="h-8 w-8" />
            ) : isSuspicious ? (
              <AlertTriangle className="h-8 w-8" />
            ) : (
              <ShieldCheck className="h-8 w-8" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-bold mb-1 ${
                isMalicious
                  ? "text-red-900 dark:text-red-200"
                  : isSuspicious
                  ? "text-amber-900 dark:text-amber-200"
                  : "text-emerald-900 dark:text-emerald-200"
              }`}
            >
              {isMalicious
                ? "⚠️ Tautan Berbahaya (Malicious)"
                : isSuspicious
                ? "⚠️ Tautan Mencurigakan (Suspicious)"
                : "✅ Tidak Ditemukan Ancaman Signifikan"}
            </h3>

            {/* Detection Score */}
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
              <span
                className={
                  isMalicious || isSuspicious
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              >
                {totalDetections}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xl font-normal">
                {" "}
                / {totalEngines}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              vendor keamanan siber mendeteksi sebagai berbahaya / mencurigakan
            </p>

            {/* Score bar */}
            <ScoreBar stats={stats} />
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attributes.title && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 shadow-xs dark:bg-slate-800/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Judul Halaman Web</p>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold truncate">
              {attributes.title}
            </p>
          </div>
        )}
        {attributes.last_analysis_date && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 shadow-xs dark:bg-slate-800/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Terakhir Dipindai</p>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
              {formatDate(attributes.last_analysis_date)}
            </p>
          </div>
        )}
        {attributes.categories && Object.keys(attributes.categories).length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 sm:col-span-2 shadow-xs dark:bg-slate-800/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Kategori Situs</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(attributes.categories).slice(0, 5).map(([vendor, cat]) => (
                <span
                  key={vendor}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white text-slate-700 border border-slate-200 font-medium shadow-xs dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                  title={`Menurut: ${vendor}`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Featured Vendors Table */}
      {featuredResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs dark:bg-slate-900 dark:border-slate-700/60">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Vendor Keamanan Utama
            </h4>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {featuredResults.map(({ vendor, result: vr }) => (
              <div
                key={vendor}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {vendor}
                </span>
                <VendorResultBadge result={vr} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Vendors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs dark:bg-slate-900 dark:border-slate-700/60">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Semua Hasil Vendor ({totalEngines} Vendor)
          </h4>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
          {displayedVendors.map(([vendorName, vr]) => (
            <div
              key={vendorName}
              className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">{vendorName}</span>
              <VendorResultBadge result={vr} />
            </div>
          ))}
        </div>
        {allVendorEntries.length > 15 && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setShowAllVendors(!showAllVendors)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800"
          >
            {showAllVendors ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Tampilkan lebih sedikit
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Tampilkan semua {allVendorEntries.length} vendor
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
