import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("URL parameter is required", { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return new NextResponse("Invalid protocol", { status: 400 });
    }

    // ============================================================
    // Engine 1: Thum.io (Ultra-fast, modern headless browser CDN)
    // ============================================================
    try {
      const thumUrl = `https://image.thum.io/get/width/1024/crop/650/${targetUrl}`;
      const controller1 = new AbortController();
      const timer1 = setTimeout(() => controller1.abort(), 6500);

      const res1 = await fetch(thumUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        signal: controller1.signal,
      });
      clearTimeout(timer1);

      if (res1.ok) {
        const buffer = await res1.arrayBuffer();
        const contentType = res1.headers.get("content-type") || "image/png";

        // Validate buffer is a real image (more than 1KB)
        if (buffer.byteLength > 1024) {
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control":
                "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
            },
          });
        }
      }
    } catch {
      // Continue to Engine 2 fallback
    }

    // ============================================================
    // Engine 2: WordPress mShots fallback
    // ============================================================
    try {
      const mShotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(
        targetUrl
      )}?w=1024&h=650`;

      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), 5000);

      const res2 = await fetch(mShotsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        signal: controller2.signal,
      });
      clearTimeout(timer2);

      if (res2.ok) {
        const buffer = await res2.arrayBuffer();
        const contentType = res2.headers.get("content-type") || "image/jpeg";

        if (buffer.byteLength > 1024) {
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control":
                "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
            },
          });
        }
      }
    } catch {
      // Both engines failed
    }

    return new NextResponse("Failed to capture screenshot", { status: 502 });
  } catch (error) {
    return new NextResponse("Timeout or error capturing screenshot", {
      status: 504,
    });
  }
}
