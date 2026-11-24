import { NextRequest, NextResponse } from "next/server";
import { validateAndNormalizeUrl, encodeToBase64Url } from "@/lib/urlValidator";
import { VirusTotalResult, VirusTotalData } from "@/lib/types";

export const runtime = "nodejs";

const VT_BASE_URL = "https://www.virustotal.com/api/v3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validate input
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Parameter URL diperlukan." },
        { status: 400 }
      );
    }

    // Validate & normalize URL
    const validation = validateAndNormalizeUrl(url);
    if (!validation.valid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const normalizedUrl = validation.normalizedUrl;

    // Check API key
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key VirusTotal belum dikonfigurasi." },
        { status: 500 }
      );
    }

    const headers = {
      "x-apikey": apiKey,
      "Content-Type": "application/json",
    };

    // Step 1: Try GET with Base64URL encoded ID
    const urlId = encodeToBase64Url(normalizedUrl);
    const getResponse = await fetch(`${VT_BASE_URL}/urls/${urlId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    // Handle rate limit
    if (getResponse.status === 429) {
      const result: VirusTotalResult = {
        status: "rate_limited",
        message:
          "Batas kuota VirusTotal tercapai (4 request/menit untuk akun gratis). Silakan coba lagi dalam beberapa detik.",
      };
      return NextResponse.json({ result }, { status: 200 });
    }

    // URL found in VirusTotal database
    if (getResponse.ok) {
      const vtData = await getResponse.json();
      const result: VirusTotalResult = {
        status: "found",
        data: vtData.data as VirusTotalData,
      };
      return NextResponse.json({ result }, { status: 200 });
    }

    // Step 2: URL not found (404) — submit for scanning
    if (getResponse.status === 404) {
      const postHeaders = {
        "x-apikey": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      const postResponse = await fetch(`${VT_BASE_URL}/urls`, {
        method: "POST",
        headers: postHeaders,
        body: `url=${encodeURIComponent(normalizedUrl)}`,
        cache: "no-store",
      });

      if (postResponse.status === 429) {
        const result: VirusTotalResult = {
          status: "rate_limited",
          message:
            "Batas kuota VirusTotal tercapai (4 request/menit untuk akun gratis). Silakan coba lagi dalam beberapa detik.",
        };
        return NextResponse.json({ result }, { status: 200 });
      }

      if (postResponse.ok) {
        const result: VirusTotalResult = {
          status: "submitted",
          message:
            "URL ini baru pertama kali dipindai oleh VirusTotal. Pemindaian sedang berjalan di latar belakang. Silakan klik tombol analisis lagi dalam 10–15 detik untuk melihat hasilnya.",
        };
        return NextResponse.json({ result }, { status: 200 });
      }

      // POST also failed
      const errorText = await postResponse.text();
      console.error("VirusTotal POST error:", postResponse.status, errorText);
      return NextResponse.json(
        { error: `Gagal mengirim URL ke VirusTotal: ${postResponse.status}` },
        { status: 502 }
      );
    }

    // Other errors from GET
    const errorText = await getResponse.text();
    console.error("VirusTotal GET error:", getResponse.status, errorText);
    return NextResponse.json(
      { error: `Error dari VirusTotal API: ${getResponse.status}` },
      { status: 502 }
    );
  } catch (error) {
    console.error("VirusTotal route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
