"use client";

import React, { useEffect } from "react";
import {
  X,
  BookOpen,
  Search,
  ShieldCheck,
  Eye,
  Bug,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 animate-slide-up my-8 dark:bg-slate-900 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Panduan Penggunaan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cara memeriksa dan menganalisis keamanan tautan
              </p>
            </div>
          </div>
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup panduan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-600 dark:text-slate-300 text-sm">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Masukkan Tautan (URL) yang Ingin Diperiksa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ketik atau tempelkan URL pada kolom input (misal:{" "}
                <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                  example.com
                </code>{" "}
                atau tautan lengkap). Jika Anda tidak mengetikkan{" "}
                <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                  https://
                </code>
                , sistem akan otomatis menambahkannya untuk Anda.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              2
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Hasil Cepat: Google Safe Browsing (Tahap 1)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sistem akan memverifikasi tautan ke basis data ancaman Google secara seketika:
              </p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Aman (Hijau):</span> Tidak ditemukan ancaman aktif pada database Google.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-semibold text-red-700 dark:text-red-400">Berbahaya (Merah):</span> Terdeteksi Phishing, Malware, atau Program Berbahaya. Jangan kunjungi situs tersebut!
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              3
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Pratinjau Visual &amp; Pelacakan Pengalihan URL
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Secara bersamaan di kolom kanan, sistem akan menampilkan:
              </p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span><strong>Visual Sandbox:</strong> Menampilkan tangkapan layar tampilan situs di lingkungan cloud terisolasi tanpa risiko script menyerang komputer Anda.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span><strong>Redirect Tracer:</strong> Melacak lompatan URL (shortener seperti bit.ly atau pengalihan berlapis) sampai ke situs tujuan sebenarnya.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              4
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Bug className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Analisis Mendalam: VirusTotal (Tahap 2)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Klik tombol <em>&ldquo;Lakukan Analisis Mendalam (VirusTotal)&rdquo;</em> untuk memindai URL ke <strong>70+ vendor antivirus dunia</strong> (Kaspersky, Bitdefender, ESET, Avast, dll) untuk mendapatkan skor agregasi reputasi keamanan.
              </p>
            </div>
          </div>

          {/* Security Tip Box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Tips Keamanan Siber:</span>
            </div>
            <p className="leading-relaxed">
              Jangan pernah memasukkan kata sandi, kode OTP, atau data pribadi ke halaman yang dicurigai sebagai tautan phishing meskipun tampilannya mirip dengan bank atau akun resmi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 dark:bg-slate-800/60 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
