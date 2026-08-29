/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },

  async headers() {
    return [
      {
        // Security headers double as trust signals for crawlers and are required
        // for a clean Lighthouse "Best Practices" score.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // Fingerprint-free static assets we control; safe to cache hard.
        source: '/:file(hero-bg.webp|hero-bg.jpg|og-image.jpg|icon-192.png|icon-512.png|apple-touch-icon.png|icon.svg|india.svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
