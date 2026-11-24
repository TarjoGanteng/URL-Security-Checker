import { NextRequest, NextResponse } from "next/server";
import { validateAndNormalizeUrl } from "@/lib/urlValidator";
import { RedirectHop, SecurityNote, TraceUrlResult } from "@/lib/types";

export const runtime = "nodejs";

const MAX_HOPS = 10;
const TIMEOUT_MS = 9000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Parameter URL diperlukan." },
        { status: 400 }
      );
    }

    const validation = validateAndNormalizeUrl(url);
    if (!validation.valid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let currentUrl = validation.normalizedUrl;
    const initialUrl = currentUrl;
    const hops: RedirectHop[] = [];
    const securityNotes: SecurityNote[] = [];
    let lastHeaders: Headers | null = null;

    // Follow redirects manually
    for (let hop = 1; hop <= MAX_HOPS; hop++) {
      let parsedCurrent: URL;
      try {
        parsedCurrent = new URL(currentUrl);
      } catch {
        break;
      }

      // Check if trying to redirect to private address
      const innerVal = validateAndNormalizeUrl(currentUrl);
      if (!innerVal.valid) {
        securityNotes.push({
          level: "danger",
          message: `Mencoba mengalihkan ke alamat lokal/terlarang: ${currentUrl}`,
        });
        break;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual", // Do NOT follow redirects automatically
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (Security-Checker-Bot)",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: controller.signal,
          cache: "no-store",
        });
      } catch (err: unknown) {
        clearTimeout(timer);
        const errMsg = err instanceof Error ? err.message : String(err);
        hops.push({
          hopNumber: hop,
          url: currentUrl,
          statusCode: 0,
          statusText: `Gagal terhubung (${errMsg})`,
          isHttps: currentUrl.startsWith("https://"),
          domain: parsedCurrent.hostname,
        });
        break;
      } finally {
        clearTimeout(timer);
      }

      lastHeaders = response.headers;
      const statusCode = response.status;
      const isRedirect = [301, 302, 303, 307, 308].includes(statusCode);
      const location = response.headers.get("location");

      hops.push({
        hopNumber: hop,
        url: currentUrl,
        statusCode,
        statusText: response.statusText || `${statusCode}`,
        locationHeader: location || undefined,
        isHttps: currentUrl.startsWith("https://"),
        domain: parsedCurrent.hostname,
      });

      if (!isRedirect || !location) {
        // Reached destination
        break;
      }

      // Resolve relative redirect URLs
      try {
        const nextUrl = new URL(location, currentUrl).toString();
        // Check for infinite redirect loop
        if (hops.some((h) => h.url === nextUrl)) {
          securityNotes.push({
            level: "warning",
            message: "Terdeteksi siklus pengalihan tanpa henti (Infinite Redirect Loop).",
          });
          break;
        }
        currentUrl = nextUrl;
      } catch {
        securityNotes.push({
          level: "warning",
          message: `Header lokasi redirect tidak valid: ${location}`,
        });
        break;
      }
    }

    const finalUrl = hops.length > 0 ? hops[hops.length - 1].url : initialUrl;
    const initialDomain = new URL(initialUrl).hostname;
    let finalDomain = initialDomain;
    try {
      finalDomain = new URL(finalUrl).hostname;
    } catch {
      // ignore
    }

    // Behavioral security checks on redirect
    if (hops.length > 1) {
      // Normalize domain for www
      const cleanInitial = initialDomain.replace(/^www\./i, "");
      const cleanFinal = finalDomain.replace(/^www\./i, "");

      // Domain change warning (real cross-domain redirection)
      if (cleanInitial !== cleanFinal) {
        securityNotes.push({
          level: "warning",
          message: `Pengalihan Domain Lintas Situs: Pengguna dialihkan dari domain awal (${initialDomain}) ke domain berbeda (${finalDomain}). Ini sering digunakan pada link pemendek atau teknik cloaking/phishing.`,
        });
      }

      // HTTPS downgraded to HTTP
      const initialHttps = initialUrl.startsWith("https://");
      const finalHttps = finalUrl.startsWith("https://");
      if (initialHttps && !finalHttps) {
        securityNotes.push({
          level: "danger",
          message: "Penurunan Protokol Keamanan (SSL Downgrade): Tautan dialihkan dari HTTPS yang aman ke HTTP polos tanpa enkripsi.",
        });
      }

      // Excessive redirects
      if (hops.length >= 4) {
        securityNotes.push({
          level: "warning",
          message: `Jumlah lompatan pengalihan banyak (${hops.length - 1} kali). Pola ini sering digunakan untuk mengelabui filter keamanan URL.`,
        });
      }
    }

    // Internal proxy screenshot route (avoids adblocker / CORS issues)
    const screenshotUrl = `/api/screenshot?url=${encodeURIComponent(finalUrl)}`;

    const result: TraceUrlResult = {
      initialUrl,
      finalUrl,
      totalRedirects: Math.max(0, hops.length - 1),
      hasRedirects: hops.length > 1,
      hops,
      securityNotes,
      screenshotUrl,
      serverHeaders: lastHeaders
        ? {
            server: lastHeaders.get("server") || undefined,
            contentType: lastHeaders.get("content-type") || undefined,
            contentLength: lastHeaders.get("content-length") || undefined,
          }
        : undefined,
    };

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Trace URL route error:", error);
    return NextResponse.json(
      { error: "Gagal menelusuri rantai pengalihan URL." },
      { status: 500 }
    );
  }
}
