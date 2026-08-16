import { createHmac } from "node:crypto";

type Bucket = { count: number; resetAt: number };

const globalSecurity = globalThis as typeof globalThis & {
  __portfolioRateLimits?: Map<string, Bucket>;
  __portfolioDuplicates?: Map<string, number>;
};

const rateLimits = globalSecurity.__portfolioRateLimits ?? new Map<string, Bucket>();
const duplicates = globalSecurity.__portfolioDuplicates ?? new Map<string, number>();

globalSecurity.__portfolioRateLimits = rateLimits;
globalSecurity.__portfolioDuplicates = duplicates;

export function clientAddress(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

export function hashIdentifier(value: string, salt: string) {
  return createHmac("sha256", salt).update(value).digest("hex");
}

export function consumeRateLimit(key: string, now = Date.now(), limit = 5, windowMs = 10 * 60 * 1000) {
  const existing = rateLimits.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function reserveDuplicate(key: string, now = Date.now(), ttlMs = 90_000) {
  for (const [entry, expiresAt] of duplicates) {
    if (expiresAt <= now) duplicates.delete(entry);
  }

  if ((duplicates.get(key) ?? 0) > now) return false;
  duplicates.set(key, now + ttlMs);
  return true;
}

export function releaseDuplicate(key: string) {
  duplicates.delete(key);
}
