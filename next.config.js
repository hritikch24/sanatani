/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
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
        // Derived image variants are content-stable: the filename encodes the
        // width, and any new artwork is emitted under a new source name.
        source: '/:file(.*\\-\\d+\\.(?:avif|webp|jpg))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:file(og-.*\\.jpg|og-image\\.jpg|icon-\\d+\\.png|apple-touch-icon\\.png|icon\\.svg|india\\.svg)',
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
