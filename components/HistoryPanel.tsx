"use client";

import React from "react";
import { History, ShieldCheck, ShieldAlert, Trash2, Clock } from "lucide-react";
import { CheckHistoryItem } from "@/lib/types";

interface HistoryPanelProps {
  history: CheckHistoryItem[];
  onSelectUrl: (url: string) => void;
  onClear: () => void;
}

function TimeAgo({ isoString }: { isoString: string }) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return <span>Baru saja</span>;
  if (diffMins < 60) return <span>{diffMins} menit lalu</span>;
  if (diffHours < 24) return <span>{diffHours} jam lalu</span>;
  return (
    <span>
      {date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
    </span>
  );
}

export default function HistoryPanel({
  history,
  onSelectUrl,
  onClear,
}: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="animate-fade-in mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold">Riwayat Pemeriksaan</h3>
          <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
            {history.length}/5
          </span>
        </div>
        <button
          type="button"
          suppressHydrationWarning
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors py-1 px-2 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
          aria-label="Hapus semua riwayat"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus semua
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            suppressHydrationWarning
            onClick={() => onSelectUrl(item.url)}
            className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700/60 dark:hover:border-slate-600 rounded-xl px-3.5 py-2.5 transition-all duration-150 group text-left shadow-sm"
            title={`Periksa ulang: ${item.url}`}
          >
            {/* Status icon */}
            <div className="flex-shrink-0">
              {item.safeBrowsingStatus === "safe" ? (
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : item.safeBrowsingStatus === "dangerous" ? (
                <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-slate-400" />
              )}
            </div>

            {/* URL and time */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400 truncate transition-colors font-medium">
                {item.url}
              </p>
              {item.threatTypes && item.threatTypes.length > 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 truncate font-medium">
                  {item.threatTypes.join(", ")}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
              <Clock className="h-3 w-3" />
              <TimeAgo isoString={item.checkedAt} />
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
        Klik item untuk memeriksa ulang URL tersebut
      </p>
    </div>
  );
}
