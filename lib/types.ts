// ============================================================
// TypeScript Types & Interfaces
// ============================================================

// --- Shared ---
export interface CheckHistoryItem {
  url: string;
  checkedAt: string; // ISO string
  safeBrowsingStatus: "safe" | "dangerous" | "error";
  threatTypes?: string[];
}

// --- URL Validator ---
export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl?: string;
  error?: string;
}

// --- Google Safe Browsing ---
export interface SafeBrowsingMatch {
  threatType: string;
  platformType: string;
  threatEntryType: string;
  threat: { url: string };
}

export interface SafeBrowsingResponse {
  matches?: SafeBrowsingMatch[];
}

export interface SafeBrowsingResult {
  safe: boolean;
  threats: Array<{
    type: string;
    platform: string;
    label: string;
  }>;
  checkedUrl: string;
  error?: string;
}

// --- VirusTotal ---
export interface VirusTotalEngineResult {
  category: string;
  engine_name: string;
  engine_version: string | null;
  result: string | null;
  method: string;
  engine_update: string;
}

export interface VirusTotalStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  timeout: number;
}

export interface VirusTotalAttributes {
  url: string;
  title?: string;
  final_url?: string;
  last_analysis_date?: number;
  last_analysis_stats: VirusTotalStats;
  last_analysis_results: Record<string, VirusTotalEngineResult>;
  categories?: Record<string, string>;
  reputation?: number;
}

export interface VirusTotalData {
  id: string;
  type: string;
  attributes: VirusTotalAttributes;
}

export interface VirusTotalResult {
  status: "found" | "submitted" | "error" | "rate_limited";
  data?: VirusTotalData;
  message?: string;
}

// --- API Response Types ---
export interface ApiSafeBrowsingResponse {
  result?: SafeBrowsingResult;
  error?: string;
}

export interface ApiVirusTotalResponse {
  result?: VirusTotalResult;
  error?: string;
}

// --- Threat Type Labels ---
export const THREAT_TYPE_LABELS: Record<string, string> = {
  MALWARE: "Malware",
  SOCIAL_ENGINEERING: "Phishing / Social Engineering",
  UNWANTED_SOFTWARE: "Unwanted Software",
  POTENTIALLY_HARMFUL_APPLICATION: "Potentially Harmful App",
  THREAT_TYPE_UNSPECIFIED: "Unknown Threat",
};

// --- Featured Security Vendors for display ---
export const FEATURED_VENDORS = [
  "Kaspersky",
  "Bitdefender",
  "Google Safebrowsing",
  "Fortinet",
  "ESET",
  "Avast",
  "McAfee",
  "Sophos",
  "Symantec",
  "Palo Alto Networks",
  "Trend Micro",
  "CrowdStrike Falcon",
  "Webroot",
  "Malwarebytes",
  "Dr.Web",
  "Emsisoft",
  "F-Secure",
  "Comodo",
];

// --- Redirect Chain & Visual Sandbox Types ---
export interface RedirectHop {
  hopNumber: number;
  url: string;
  statusCode: number;
  statusText: string;
  locationHeader?: string;
  isHttps: boolean;
  domain: string;
}

export interface SecurityNote {
  level: "warning" | "danger" | "info";
  message: string;
}

export interface TraceUrlResult {
  initialUrl: string;
  finalUrl: string;
  totalRedirects: number;
  hasRedirects: boolean;
  hops: RedirectHop[];
  securityNotes: SecurityNote[];
  screenshotUrl?: string;
  serverHeaders?: {
    server?: string;
    contentType?: string;
    contentLength?: string;
  };
}

export interface ApiTraceResponse {
  result?: TraceUrlResult;
  error?: string;
}

