import { UrlValidationResult } from "./types";

// Private/local IP patterns to block
const PRIVATE_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^\[::1\]$/,
  /^169\.254\.\d+\.\d+$/, // Link-local
  /^fc[0-9a-f]{2}:/i,     // IPv6 ULA
];

/**
 * Validates and normalizes a URL string.
 * - Automatically prepends https:// if no protocol is provided
 * - Rejects private/local addresses
 * - Returns normalized URL or error message
 */
export function validateAndNormalizeUrl(input: string): UrlValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, error: "URL tidak boleh kosong." };
  }

  // Auto-prefix protocol if missing
  let urlString = trimmed;
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  // Try parsing the URL
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { valid: false, error: "Format URL tidak valid. Pastikan URL sudah benar." };
  }

  // Only allow http and https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Hanya URL dengan protokol http:// atau https:// yang diizinkan." };
  }

  const hostname = parsed.hostname;

  // Block private/local addresses
  for (const pattern of PRIVATE_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        valid: false,
        error: "URL lokal atau privat tidak dapat diperiksa (localhost, 127.0.0.1, 192.168.x.x, dll).",
      };
    }
  }

  // Block empty hostname
  if (!hostname || hostname.length < 2) {
    return { valid: false, error: "Hostname URL tidak valid." };
  }

  // Must have at least one dot in hostname (basic TLD check), unless it's an IP
  const isIpv4 = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
  if (!isIpv4 && !hostname.includes(".")) {
    return { valid: false, error: "URL harus memiliki domain yang valid (misalnya: example.com)." };
  }

  return { valid: true, normalizedUrl: urlString };
}

/**
 * Encodes a URL to Base64URL format used by VirusTotal API
 * Base64URL replaces + with -, / with _, and removes padding =
 */
export function encodeToBase64Url(url: string): string {
  const base64 = Buffer.from(url).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
