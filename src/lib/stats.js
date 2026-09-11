// Shared usage stats backed by Upstash Redis.
// Two namespaces — "bot" and "site" — tracked identically so the bot can
// read the site's numbers (and vice-versa) from the same store.
//
// Data model (per namespace NS = bot | site):
//   stat:<NS>:first  ZSET  member=userId, score=firstSeenMs  (for "total" + "new")
//   stat:<NS>:seen   ZSET  member=userId, score=lastSeenMs   (for "active")
//
// Totals/actives/new are all O(log n) ZCARD/ZCOUNT — no key scanning.

import { Redis } from '@upstash/redis';

// The Vercel/Upstash integration exposes KV_REST_API_URL / KV_REST_API_TOKEN
// (not the UPSTASH_* names Redis.fromEnv() expects), so wire them explicitly.
let _redis = null;
export function getRedis() {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null; // stats are best-effort; never crash callers
  _redis = new Redis({ url, token });
  return _redis;
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Record one interaction from `userId` in namespace `ns` ('bot' | 'site').
 * First-seen is set once (NX); last-seen is refreshed every call.
 */
export async function trackUser(ns, userId) {
  const redis = getRedis();
  if (!redis || userId == null) return;
  const id = String(userId);
  const now = Date.now();
  try {
    await Promise.all([
      // NX: keep the earliest first-seen, don't overwrite it.
      redis.zadd(`stat:${ns}:first`, { nx: true }, { score: now, member: id }),
      redis.zadd(`stat:${ns}:seen`, { score: now, member: id }),
    ]);
  } catch {
    /* best-effort: swallow so a stats hiccup never breaks the app/bot */
  }
}

/**
 * Read a summary for one namespace: total users, active in the last 24h / 7d,
 * and new (first-seen) in the last 24h / 7d.
 */
export async function getStats(ns) {
  const redis = getRedis();
  const empty = { total: 0, active24h: 0, active7d: 0, new24h: 0, new7d: 0 };
  if (!redis) return empty;
  const now = Date.now();
  try {
    const [total, active24h, active7d, new24h, new7d] = await Promise.all([
      redis.zcard(`stat:${ns}:first`),
      redis.zcount(`stat:${ns}:seen`, now - DAY, '+inf'),
      redis.zcount(`stat:${ns}:seen`, now - 7 * DAY, '+inf'),
      redis.zcount(`stat:${ns}:first`, now - DAY, '+inf'),
      redis.zcount(`stat:${ns}:first`, now - 7 * DAY, '+inf'),
    ]);
    return {
      total: total || 0,
      active24h: active24h || 0,
      active7d: active7d || 0,
      new24h: new24h || 0,
      new7d: new7d || 0,
    };
  } catch {
    return empty;
  }
}

/** Both namespaces at once. */
export async function getAllStats() {
  const [bot, site] = await Promise.all([getStats('bot'), getStats('site')]);
  return { bot, site };
}
