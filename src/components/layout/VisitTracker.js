'use client';

import { useEffect } from 'react';

// Pings /api/track once per browser session with a stable anonymous id, so
// the shared stats store can count unique site visitors + activity. No PII.
export default function VisitTracker() {
  useEffect(() => {
    try {
      const KEY = 'armHelper_vid';
      let vid = localStorage.getItem(KEY);
      if (!vid) {
        vid =
          (crypto?.randomUUID?.() ??
            Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, '');
        localStorage.setItem(KEY, vid);
      }
      // One ping per tab session is enough to mark activity for the day.
      if (sessionStorage.getItem('armHelper_tracked')) return;
      sessionStorage.setItem('armHelper_tracked', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: vid }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* localStorage/crypto unavailable — skip silently */
    }
  }, []);

  return null;
}
