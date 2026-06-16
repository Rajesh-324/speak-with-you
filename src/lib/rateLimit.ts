// ============================================================
// Sliding Window Rate Limiter (In-Memory)
// ============================================================

import { NextRequest } from "next/server";

interface RateLimitStore {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitStore>();

// 30 requests per minute
const LIMIT = 30;
const WINDOW_MS = 60 * 1000;

/**
 * Check if the request is rate-limited based on IP or UID.
 * Returns true if rate limited, false if allowed.
 */
export function checkRateLimit(request: NextRequest, identifier?: string): boolean {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const key = identifier || ip;

  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (record.timestamps.length >= LIMIT) {
    return true; // Throttled!
  }

  // Record this hit
  record.timestamps.push(now);
  return false;
}
