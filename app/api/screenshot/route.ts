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
    // Special Handling: YouTube & Google Video Platforms
    // (Google blocks headless datacenter bots from loading full page,
    // so we serve their high-res official media banners instantly)
    // ============================================================
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname === "youtu.be"
    ) {
      // Priority 1: Specific video thumbnail
      const v = parsed.searchParams.get("v");
      let ytVideoId: string | null = v;
      if (!ytVideoId && parsed.hostname === "youtu.be") {
        ytVideoId = parsed.pathname.replace(/^\//, "") || null;
      }

      if (ytVideoId) {
        // Try maxresdefault, fallback to hqdefault
        for (const quality of ["maxresdefault", "hqdefault"]) {
          try {
            const thumbUrl = `https://img.youtube.com/vi/${ytVideoId}/${quality}.jpg`;
            const ytRes = await fetch(thumbUrl, { cache: "no-store" });
            if (ytRes.ok) {
              const buffer = await ytRes.arrayBuffer();
              if (buffer.byteLength > 5000) {
                return new NextResponse(buffer, {
                  status: 200,
                  headers: {
                    "Content-Type": "image/jpeg",
                    "Cache-Control":
                      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
                  },
                });
              }
            }
          } catch { /* try next */ }
        }
      }

      // Priority 2: YouTube homepage / channel / search — use official OG image
      // YouTube's OG image is always this static banner (served from Google CDN, no bot block)
      const ytBanners = [
        "https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg",
        "https://yt3.googleusercontent.com/ytc/AIdro_kaKhqkPqnPJi3JF98lNDJjkimevkF9wQEByRXdTHGzqw=s900-c-k-c0x00ffffff-no-rj",
      ];

      for (const bannerUrl of ytBanners) {
        try {
          const r = await fetch(bannerUrl, {
            headers: { "User-Agent": "Mozilla/5.0 compatible Googlebot" },
            cache: "no-store",
          });
          if (r.ok) {
            const buffer = await r.arrayBuffer();
            const ct = r.headers.get("content-type") || "image/jpeg";
            if (buffer.byteLength > 500) {
              return new NextResponse(buffer, {
                status: 200,
                headers: {
                  "Content-Type": ct,
                  "Cache-Control":
                    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
                },
              });
            }
          }
        } catch { /* try next */ }
      }

      // Last resort: return a 302 redirect to the YouTube logo PNG so browser shows something
      return NextResponse.redirect(
        "https://www.youtube.com/img/desktop/yt_1200.png",
        { status: 302 }
      );
    }

    // ============================================================
    // Engine 1: Thum.io (Fast Headless Browser CDN)
    // ============================================================
    try {
      const thumUrl = `https://image.thum.io/get/width/1024/crop/650/${targetUrl}`;
      const controller1 = new AbortController();
      const timer1 = setTimeout(() => controller1.abort(), 6000);

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

        // Filter out small generic error placeholders
        if (buffer.byteLength > 2000) {
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
      // Continue to Engine 2
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

        if (buffer.byteLength > 1000) {
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
