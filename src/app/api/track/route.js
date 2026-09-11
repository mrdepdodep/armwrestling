import { trackUser } from '@/lib/stats';

// The browser posts an anonymous visitor id (kept in localStorage) once per
// session. We only ever store that opaque id + timestamps — no PII.
export async function POST(req) {
  try {
    const { visitorId } = await req.json();
    if (typeof visitorId === 'string' && visitorId.length >= 8 && visitorId.length <= 64) {
      await trackUser('site', visitorId);
    }
  } catch {
    /* ignore malformed bodies */
  }
  return Response.json({ ok: true });
}
