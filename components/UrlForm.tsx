"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Shield, Link, AlertCircle } from "lucide-react";
import { validateAndNormalizeUrl } from "@/lib/urlValidator";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    const validation = validateAndNormalizeUrl(inputValue);
    if (!validation.valid || !validation.normalizedUrl) {
      setClientError(validation.error || "URL tidak valid.");
      inputRef.current?.focus();
      return;
    }

    onSubmit(validation.normalizedUrl);
    setInputValue(validation.normalizedUrl);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (clientError) setClientError(null);
  };

  const handlePaste = () => {
    if (clientError) setClientError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" suppressHydrationWarning>
      <div className="relative group">
        {/* Input field */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all duration-200 shadow-sm dark:bg-slate-800/80 dark:border-slate-700 dark:focus-within:bg-slate-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20">
          <Link
            className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="Masukkan URL yang ingin diperiksa... (contoh: example.com)"
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 outline-none text-sm font-mono font-medium"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            aria-label="URL yang akan diperiksa"
            aria-describedby={clientError ? "url-error" : undefined}
            suppressHydrationWarning
          />
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setClientError(null);
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors text-xs p-1"
              aria-label="Hapus input"
              suppressHydrationWarning
            >
              ✕
            </button>
          )}
        </div>

        {/* Error message */}
        {clientError && (
          <div
            id="url-error"
            className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-fade-in"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{clientError}</span>
          </div>
        )}
      </div>

      {/* Hint text */}
      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
        Jika URL tanpa protokol, akan otomatis ditambahkan{" "}
        <span className="font-mono text-slate-600 dark:text-slate-300">https://</span>
      </p>

      {/* Submit button */}
      <button
        type="submit"
        suppressHydrationWarning
        disabled={isLoading || (mounted && !inputValue.trim())}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-600/20"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Memeriksa...</span>
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span>Periksa Keamanan URL</span>
          </>
        )}
      </button>
    </form>
  );
}
