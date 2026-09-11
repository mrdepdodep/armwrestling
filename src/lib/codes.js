// Server-side reader for custom codes added via the Telegram bot's /addcode.
// Same Upstash Redis store the bot writes to (codes:custom HASH).

import { getRedis } from './stats';

const CUSTOM_KEY = 'codes:custom';

// Returns custom codes as [{ code, hours, reward, ts }], newest first.
// Best-effort: on any failure (or no Redis) returns [].
export async function getCustomCodes() {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const all = await redis.hgetall(CUSTOM_KEY);
    if (!all) return [];
    return Object.values(all)
      .map((v) => (typeof v === 'string' ? JSON.parse(v) : v))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch {
    return [];
  }
}
