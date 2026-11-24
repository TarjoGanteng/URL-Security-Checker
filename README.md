# 🛡️ URL Security Checker

Aplikasi pemeriksa keamanan tautan (*URL security scanner*) modern berbasis web yang dibangun dengan **Next.js 15 (App Router)**, **TypeScript**, dan **Tailwind CSS**. Aplikasi ini mengintegrasikan deteksi ancaman multi-layer untuk melindungi pengguna dari kejahatan siber seperti *phishing*, malware, dan rekayasa sosial (*social engineering*).

---

## ✨ Fitur Utama

1. **Google Safe Browsing (Tahap 1 - Instan)**
   - Pengecekan kilat terhadap basis data ancaman global Google.
   - Mendeteksi *Malware*, *Social Engineering / Phishing*, dan *Unwanted Software*.

2. **Visual Sandbox & Redirect Tracer**
   - **Pratinjau Visual Terisolasi**: Tangkapan layar (*screenshot*) situs target di cloud sandbox tanpa menjalankan script/malware di browser pengguna.
   - **Pelacak Pengalihan URL (*Redirect Chain*)**: Menelusuri rantai pengalihan bertingkat (shortlink seperti bit.ly, cloaking URL) lengkap dengan kode status HTTP di setiap lompatan.

3. **VirusTotal Multi-Engine Analysis (Tahap 2 - Analisis Mendalam)**
   - Pengecekan multi-engine terhadap **70+ vendor keamanan siber dunia** (Kaspersky, Bitdefender, ESET, Sophos, Fortinet, Malwarebytes, dll).
   - Menampilkan persentase deteksi reputasi, skor agregasi, dan detail respon vendor.

4. **Tampilan Modern & Fleksibel**
   - Pengaturan tema **Dark Mode** 🌙 dan **Light Mode** ☀️ dengan satu klik.
   - Deteksi otomatis tema preferensi perangkat pengguna (*prefers-color-scheme*).
   - Modal interaktif untuk **Panduan Penggunaan** dan **Bantuan / Kontak**.
   - Riwayat pencarian tersimpan lokal (*local storage*).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **APIs**:
  - Google Safe Browsing API v4
  - VirusTotal API v3
  - WordPress mShots CDN Proxy

---

## 🚀 Panduan Menjalankan di Lokal

### 1. Kloning Repository
```bash
git clone https://github.com/USERNAME/url-security-checker.git
cd url-security-checker
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu buka file `.env.local` dan masukkan API Key Anda:
```env
GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
```

> **Catatan Mendapatkan API Key**:
> - **Google Safe Browsing**: Dapatkan gratis di [Google Cloud Console](https://console.cloud.google.com/) -> Aktifkan *Safe Browsing API*.
> - **VirusTotal**: Daftar akun gratis di [VirusTotal](https://www.virustotal.com/) -> Buka profil -> *API Key*.

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser dan akses **`http://localhost:3000`**.

---

## ☁️ Deploy ke Vercel

1. Push repository ini ke GitHub Anda.
2. Buka [Vercel](https://vercel.com/) dan import repository ini.
3. Masukkan Environment Variables di Vercel:
   - `GOOGLE_SAFE_BROWSING_API_KEY`
   - `VIRUSTOTAL_API_KEY`
4. Klik **Deploy**! ✅
