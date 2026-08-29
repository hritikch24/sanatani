/**
 * सनातन परिवार service worker.
 *
 * The previous version was cache-first for *everything*, forever, under a cache
 * name that never changed — so a returning visitor could never receive updated
 * HTML or assets. This version splits the strategy by request type:
 *
 *   - navigations / HTML → network-first (content is always fresh, cache is
 *     only a fallback when offline)
 *   - immutable static assets (/_next/static, images, fonts) → cache-first,
 *     which is safe because those URLs are content-addressed or versioned
 *   - everything else → straight to the network
 *
 * Bump CACHE whenever the caching rules themselves change; old caches are
 * deleted on activate.
 */
const CACHE = 'sp-v3';
const OFFLINE_FALLBACK = '/';

const IMMUTABLE = /^\/(_next\/static\/|hero-\d+\.(avif|webp|jpg)$|og-image\.jpg$|icon(-\d+)?\.(png|svg)$|apple-touch-icon\.png$|india\.svg$|manifest\.json$)/;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll([OFFLINE_FALLBACK]))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // Same-origin only; never touch the API.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // HTML and navigations: always try the network first so new pages and
  // content edits show up immediately. Fall back to cache only when offline.
  const isNav = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNav) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match(OFFLINE_FALLBACK)))
    );
    return;
  }

  // Versioned / content-addressed assets: cache-first is safe and fast.
  if (IMMUTABLE.test(url.pathname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      }))
    );
    return;
  }

  // Anything else (sitemap, robots, llms.txt, ...) goes straight to the network.
});
