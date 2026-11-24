import { NextRequest, NextResponse } from "next/server";
import { validateAndNormalizeUrl } from "@/lib/urlValidator";
import {
  SafeBrowsingResult,
  SafeBrowsingResponse,
  THREAT_TYPE_LABELS,
} from "@/lib/types";

export const runtime = "nodejs";

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
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key Google Safe Browsing belum dikonfigurasi." },
        { status: 500 }
      );
    }

    // Call Google Safe Browsing API v4
    const safeBrowsingUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const requestBody = {
      client: {
        clientId: "url-security-checker",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: normalizedUrl }],
      },
    };

    const response = await fetch(safeBrowsingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Safe Browsing API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Error dari Google Safe Browsing API: ${response.status}` },
        { status: 502 }
      );
    }

    const data: SafeBrowsingResponse = await response.json();

    // Build result
    const result: SafeBrowsingResult = {
      safe: !data.matches || data.matches.length === 0,
      threats: (data.matches || []).map((match) => ({
        type: match.threatType,
        platform: match.platformType,
        label: THREAT_TYPE_LABELS[match.threatType] || match.threatType,
      })),
      checkedUrl: normalizedUrl,
    };

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Safe Browsing route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
