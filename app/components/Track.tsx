'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fires one lightweight beacon per page view. No cookies: the session id lives
 * in sessionStorage and dies with the tab. Failures are swallowed — analytics
 * must never affect the page.
 */
export default function Track() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/metrics')) return;

    let session: string;
    try {
      session = sessionStorage.getItem('_sp_sid') || '';
      if (!session) {
        session = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));
        sessionStorage.setItem('_sp_sid', session);
      }
    } catch {
      // Private mode / storage blocked: still count the view, just not the session.
      session = 'nostore-' + Math.random().toString(36).slice(2);
    }

    const utm = new URLSearchParams(window.location.search).get('utm_source');
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      session,
      utm,
    });

    try {
      const blob = new Blob([payload], { type: 'application/json' });
      if (!navigator.sendBeacon?.('/api/track', blob)) {
        fetch('/api/track', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
      }
    } catch {
      fetch('/api/track', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
