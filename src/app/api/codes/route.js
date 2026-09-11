import { getCustomCodes } from '@/lib/codes';

// Custom codes are added live via the bot; never cache this route.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Returns only the custom (bot-added) codes. The page merges these on top of
// its bundled static list. Shape matches the static entries the UI expects.
export async function GET() {
  let custom = [];
  try {
    custom = (await getCustomCodes()).map((c) => ({
      id: c.code,
      code: c.code,
      hours: c.hours ?? 0,
      reward: c.reward || null,
      isNew: true,
    }));
  } catch {
    custom = [];
  }
  return Response.json({ codes: custom }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
