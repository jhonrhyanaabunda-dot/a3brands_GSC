import "server-only";

import type { ScanError } from "./types";

const MAX_BODY_BYTES = 2_500_000;
const FETCH_TIMEOUT_MS = 12_000;

// Primary UA: real Chrome string with a trailing identifier
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 A3BrandsAuditBot/1.0";

// Retry UA: Googlebot. Some WAFs allow Googlebot UA even without reverse-DNS
// validation, so this is a free second attempt when Chrome gets 403'd.
const GOOGLEBOT_UA =
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/130.0.0.0 Safari/537.36";

// Blocklist for SSRF safety. We never fetch these.
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127(\.\d+){3}$/,
  /^10(\.\d+){3}$/,
  /^192\.168(\.\d+){2}$/,
  /^172\.(1[6-9]|2\d|3[0-1])(\.\d+){2}$/,
  /^169\.254(\.\d+){2}$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fe80:/i,
  /^metadata\.google\.internal$/i,
];

export function normalizeUrl(
  input: string,
): { url: string; domain: string } | null {
  const cleaned = input.trim();
  if (cleaned.length < 4) return null;
  const withScheme = /^https?:\/\//i.test(cleaned)
    ? cleaned
    : `https://${cleaned}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return {
      url: u.toString().replace(/\/$/, ""),
      domain: u.hostname.replace(/^www\./, ""),
    };
  } catch {
    return null;
  }
}

function isBlockedHost(hostname: string): boolean {
  return PRIVATE_HOST_PATTERNS.some((p) => p.test(hostname));
}

export interface FetchedPage {
  finalUrl: string;
  html: string;
  status: number;
  contentType: string | null;
  headers: Headers;
  redirected: boolean;
  fetchMs: number;
  byteSize: number;
  userAgentUsed: "chrome" | "googlebot";
}

async function attemptFetch(
  target: URL,
  userAgent: string,
  tag: "chrome" | "googlebot",
): Promise<{ ok: true; page: FetchedPage } | { ok: false; error: ScanError }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const t0 = Date.now();

  let res: Response;
  try {
    res = await fetch(target.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/xhtml+xml,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
      },
    });
  } catch (err) {
    clearTimeout(timer);
    const isTimeout =
      err instanceof DOMException && err.name === "AbortError"
        ? true
        : (err as Error)?.name === "AbortError";
    return {
      ok: false,
      error: {
        code: isTimeout ? "TIMEOUT" : "FETCH_FAILED",
        message: isTimeout
          ? "Request timed out after 12 seconds."
          : `Could not reach the site: ${(err as Error)?.message ?? "unknown"}`,
      },
    };
  }
  clearTimeout(timer);

  const fetchMs = Date.now() - t0;
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let message = `Server responded with ${res.status} ${res.statusText}.`;
    if (res.status === 403) {
      message =
        "403 Forbidden - the site blocked our scanner. This usually means Cloudflare, Akamai, or a WAF is filtering bot traffic.";
    } else if (res.status === 404) {
      message = "404 Not Found - the URL doesn't resolve to a page.";
    } else if (res.status === 429) {
      message =
        "429 Too Many Requests - the site is rate-limiting us. Try again in a moment.";
    } else if (res.status === 503) {
      message =
        "503 Service Unavailable - the site rejected the request (often Cloudflare's bot challenge).";
    }
    return { ok: false, error: { code: "HTTP_ERROR", message } };
  }

  if (contentType && !/text\/html|application\/xhtml/i.test(contentType)) {
    return {
      ok: false,
      error: {
        code: "NOT_HTML",
        message: `Expected HTML, got ${contentType.split(";")[0]}.`,
      },
    };
  }

  // Read body with a cap
  const reader = res.body?.getReader();
  let total = 0;
  const chunks: Uint8Array[] = [];
  if (reader) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return {
          ok: false,
          error: {
            code: "TOO_LARGE",
            message: `Page exceeded ${(MAX_BODY_BYTES / 1_000_000).toFixed(1)}MB limit.`,
          },
        };
      }
      chunks.push(value);
    }
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);

  return {
    ok: true,
    page: {
      finalUrl: res.url,
      html,
      status: res.status,
      contentType,
      headers: res.headers,
      redirected: res.redirected,
      fetchMs,
      byteSize: total,
      userAgentUsed: tag,
    },
  };
}

export async function fetchPage(
  url: string,
): Promise<{ ok: true; page: FetchedPage } | { ok: false; error: ScanError }> {
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return {
      ok: false,
      error: { code: "INVALID_URL", message: "Could not parse URL." },
    };
  }
  if (isBlockedHost(target.hostname)) {
    return {
      ok: false,
      error: {
        code: "BLOCKED_HOST",
        message: "Hostname is not allowed for scanning.",
      },
    };
  }

  // First attempt: Chrome UA
  const primary = await attemptFetch(target, CHROME_UA, "chrome");
  if (primary.ok) return primary;

  // Only retry on 403 - other errors are real (DNS fail, timeout, 5xx, etc.)
  const is403 =
    primary.error.code === "HTTP_ERROR" &&
    primary.error.message.startsWith("403");
  if (!is403) return primary;

  // Retry with Googlebot UA (free second chance - many sites allow Googlebot)
  const retry = await attemptFetch(target, GOOGLEBOT_UA, "googlebot");
  return retry;
}

export async function fetchText(
  url: string,
  timeoutMs = 6000,
): Promise<{ ok: boolean; status: number; text: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": CHROME_UA },
    });
    clearTimeout(timer);
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch {
    clearTimeout(timer);
    return { ok: false, status: 0, text: "" };
  }
}

export async function headRequest(
  url: string,
  timeoutMs = 6000,
): Promise<{ ok: boolean; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": CHROME_UA },
    });
    clearTimeout(timer);
    return { ok: res.ok, status: res.status };
  } catch {
    clearTimeout(timer);
    return { ok: false, status: 0 };
  }
}
