import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DRIVE_UC_URL = "https://drive.google.com/uc";
const DRIVE_CDN_URL = "https://drive.usercontent.google.com/download";

/**
 * Extracts the direct download URL from Google Drive's virus-scan
 * confirmation HTML page (shown for files larger than 100 MB).
 *
 * The HTML contains a form with hidden inputs for `id`, `confirm`,
 * and `uuid`. Constructing that GET URL bypasses the virus-scan
 * warning and serves the raw file bytes.
 */
function extractDownloadUrl(html: string): string | null {
  const idMatch = html.match(/name="id"\s+value="([^"]+)"/);
  const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
  const confirmMatch = html.match(/name="confirm"\s+value="([^"]+)"/);

  if (!idMatch || !uuidMatch) return null;

  const fileId = idMatch[1];
  const uuid = uuidMatch[1];
  const confirm = confirmMatch?.[1] ?? "t";

  return `${DRIVE_CDN_URL}?id=${fileId}&confirm=${confirm}&uuid=${uuid}`;
}

/**
 * Headers from Google that must not be forwarded to the browser.
 * Some (CORP/CSP/X-Frame-Options) are designed to prevent exactly the
 * kind of cross-origin embedding this route exists to enable, and they
 * would otherwise confuse the media element or break playback.
 */
const BLOCKED_HEADERS = new Set([
  "content-security-policy",
  "x-content-security-policy",
  "x-frame-options",
  "cross-origin-resource-policy",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "content-disposition",
]);

/**
 * GET /api/drive/:id
 *
 * Same-origin proxy that streams a Google Drive video to the browser.
 * This exists because Google serves Drive files with a
 * `Cross-Origin-Resource-Policy: same-site` header (and, for files over
 * 100 MB, a virus-scan HTML page), so a `<video>` tag cannot load them
 * directly from another origin. Here the bytes are fetched server-side
 * and streamed back same-origin with seekable range support.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  try {
    // Forward the browser's range request so <video> can seek.
    const rangeHeader = request.headers.get("range");
    const fetchHeaders: Record<string, string> = {};
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    // First attempt: hit the standard `uc?id=` endpoint. For files under
    // 100 MB Google 303-redirects to the content CDN and streams
    // `video/mp4`. For larger files it returns a small HTML
    // virus-scan page instead — handled below.
    const ucUrl = `${DRIVE_UC_URL}?id=${id}`;
    let driveResponse = await fetch(ucUrl, {
      method: "GET",
      headers: fetchHeaders,
      cache: "no-store",
    });

    const contentType = driveResponse.headers.get("Content-Type") || "";

    // Large file — Google returned an HTML virus-scan confirmation page.
    // Parse the form fields, then re-request from the content CDN.
    if (contentType.startsWith("text/html")) {
      const html = await driveResponse.text();
      const downloadUrl = extractDownloadUrl(html);
      if (!downloadUrl) {
        throw new Error("Could not resolve Google Drive download URL");
      }
      driveResponse = await fetch(downloadUrl, {
        method: "GET",
        headers: fetchHeaders,
        cache: "no-store",
      });
    }

    if (!driveResponse.ok && driveResponse.status !== 206) {
      throw new Error(`Google Drive responded with ${driveResponse.status}`);
    }

    // Forward Google's response headers, skipping ones that conflict
    // with the proxy response or would block inline playback.
    const responseHeaders = new Headers();
    driveResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        BLOCKED_HEADERS.has(lower) ||
        ["transfer-encoding", "connection", "content-encoding"].includes(
          lower,
        )
      ) {
        return;
      }
      responseHeaders.set(key, value);
    });

    // The proxy response is same-origin, but keep CORS headers anyway.
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set(
      "Access-Control-Expose-Headers",
      "Content-Range, Content-Length, Content-Type, Accept-Ranges",
    );
    responseHeaders.set("Accept-Ranges", "bytes");
    responseHeaders.set("Content-Disposition", "inline");

    if (!responseHeaders.has("Content-Type")) {
      responseHeaders.set("Content-Type", "video/mp4");
    }

    return new NextResponse(driveResponse.body, {
      status: driveResponse.status,
      statusText: driveResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[api/drive] Error streaming video:", error);
    return NextResponse.json(
      { error: "Failed to stream video from Google Drive" },
      { status: 502 },
    );
  }
}
