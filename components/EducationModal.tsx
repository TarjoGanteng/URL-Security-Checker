"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  GraduationCap,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EducationModal({
  isOpen,
  onClose,
}: EducationModalProps) {
  const [activeTab, setActiveTab] = useState<"anatomy" | "tactics" | "tips">(
    "anatomy"
  );

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
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-800/60">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pusat Edukasi &amp; Literasi Keamanan Tautan</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pahami cara mengenali dan menghindari penipuan tautan berbahaya
              </p>
            </div>
          </div>
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup edukasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-950/30 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("anatomy")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "anatomy"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>1. Anatomi Tautan (URL)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tactics")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "tactics"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>2. Trik Penipuan Populer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tips")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "tips"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>3. Tips Sebelum Klik</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-slate-600 dark:text-slate-300 text-sm space-y-5">
          {/* TAB 1: ANATOMI URL */}
          {activeTab === "anatomy" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 dark:bg-slate-800/50 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Contoh Tautan Phishing yang Sering Mengecoh:
                </p>
                {/* Visual URL Breakdown */}
                <div className="flex flex-wrap items-center gap-1 font-mono text-xs p-3 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 break-all select-all">
                  <span className="text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.5 rounded">
                    https://
                  </span>
                  <span className="text-blue-600 font-semibold bg-blue-50 dark:bg-blue-950/50 px-1 py-0.5 rounded">
                    klikbca.
                  </span>
                  <span className="text-red-600 font-bold bg-red-50 dark:bg-red-950/50 px-1 py-0.5 rounded">
                    login-verifikasi.com
                  </span>
                  <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                    /akun/login
                  </span>
                </div>

                {/* Explanation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs">
                  <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-900">
                    <span className="font-bold text-blue-700 dark:text-blue-300 block mb-0.5">
                      Subdomain Pancingan
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Pelaku menulis kata &ldquo;klikbca&rdquo; untuk menipu mata korban.
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-red-300 bg-red-50/70 dark:bg-red-950/30 dark:border-red-900 sm:col-span-2">
                    <span className="font-bold text-red-700 dark:text-red-300 block mb-0.5">
                      Domain Utama Sebenarnya (Bahaya!)
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Pemilik asli situs ini adalah <strong>login-verifikasi.com</strong> (bukan BCA). Semua data kata sandi akan dicuri oleh domain ini.
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Rules */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">
                  Kaidah Membaca Domain yang Benar:
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>
                    Lihatlah bagian <strong>tepat sebelum tanda garis miring pertama (/)</strong>. Itulah domain yang bertanggung jawab atas situs tersebut.
                  </li>
                  <li>
                    Gembok hijau / HTTPS (<code>https://</code>) <strong>TIDAK menjamin situs aman dari penipuan</strong>. HTTPS hanya mengamankan transmisi data, namun penipu juga bisa dengan mudah memasang sertifikat HTTPS gratis.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: TRIK PENIPUAN POPULER */}
          {activeTab === "tactics" && (
            <div className="space-y-3.5 animate-fade-in text-xs">
              {/* Tactic 1 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  <span>1. Typosquatting (Salah Ketik yang Disengaja)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Penipu mendaftarkan nama domain yang sangat mirip dengan situs aslinya, seperti mengganti huruf &lsquo;l&rsquo; dengan angka &lsquo;1&rsquo; atau huruf &lsquo;o&rsquo; dengan angka &lsquo;0&rsquo;.
                </p>
                <div className="flex items-center gap-3 pt-1 font-mono text-[11px]">
                  <span className="text-slate-400">Palsu: paypa1.com</span>
                  <span className="text-emerald-600 font-semibold">Asli: paypal.com</span>
                </div>
              </div>

              {/* Tactic 2 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>2. Pemendek Tautan Terselubung (Shortlink Cloaking)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tautan penipuan disembunyikan menggunakan layanan shortlink (seperti bit.ly, tinyurl, dll) sehingga korban tidak bisa melihat alamat aslinya sebelum mengklik.
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold pt-1">
                  Solusi: Gunakan fitur <strong>Redirect Tracer</strong> di aplikasi ini untuk melihat tujuan asli sebelum membuka tautan.
                </p>
              </div>

              {/* Tactic 3 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                  <HelpCircle className="h-4 w-4" />
                  <span>3. Pesan Darurat / Hadiah Palsu (Social Engineering)</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mengirim pesan pancingan seperti <em>&ldquo;Rekening Anda dibekukan! Segera verifikasi&rdquo;</em> atau <em>&ldquo;Undian berhadiah resmi&rdquo;</em> untuk memicu rasa panik atau serakah agar korban langsung mengklik tanpa berpikir panjang.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TIPS SEBELUM KLIK */}
          {activeTab === "tips" && (
            <div className="space-y-3 animate-fade-in text-xs">
              {[
                {
                  title: "1. Berhenti & Berpikir Sejenak (Stop & Think)",
                  desc: "Instansi resmi (Bank, Pemerintah, Layanan Resmi) tidak pernah meminta kata sandi, PIN, atau OTP melalui tautan di pesan instan (WhatsApp, Telegram, atau SMS).",
                },
                {
                  title: "2. Arahkan Kursor (Hover) Sebelum Klik",
                  desc: "Jika Anda menggunakan komputer/laptop, arahkan kursor mouse ke tautan tanpa mengkliknya. Perhatikan pojok kiri bawah browser untuk melihat alamat sebenarnya.",
                },
                {
                  title: "3. Periksa Menggunakan URL Security Checker",
                  desc: "Salin tautan yang dicurigai dan tempelkan ke aplikasi ini untuk memverifikasi reputasinya melalui Google Safe Browsing, VirusTotal, dan pratinjau sandbox aman.",
                },
                {
                  title: "4. Akses Situs Langsung Lewat Aplikasi Resmi",
                  desc: "Jika menerima notifikasi penting dari bank atau marketplace, jangan klik tautan di pesan. Buka langsung aplikasi resminya di ponsel Anda.",
                },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                      {tip.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 dark:bg-slate-800/60 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Edukasi Keamanan Siber • URL Security Checker
          </span>
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
