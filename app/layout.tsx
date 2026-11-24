import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Security Checker – Pemeriksa Keamanan Tautan",
  description:
    "Periksa keamanan URL secara instan menggunakan Google Safe Browsing dan VirusTotal. Lindungi diri dari phishing, malware, dan ancaman online.",
  keywords: ["url checker", "keamanan url", "safe browsing", "virus total", "phishing checker"],
  authors: [{ name: "URL Security Checker" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: "noindex, nofollow",
  openGraph: {
    title: "URL Security Checker",
    description: "Periksa keamanan URL menggunakan Google Safe Browsing & VirusTotal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
