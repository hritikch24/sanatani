import type { MetadataRoute } from 'next';

const SITE = 'https://sanatanparivar.in';

/**
 * Generated at build time so lastmod never goes stale by hand.
 * Keep priorities honest: the pages people actually search for rank highest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, freq: 'daily' },
    { path: '/upasthiti', priority: 0.9, freq: 'hourly' },
    { path: '/shloka', priority: 0.9, freq: 'daily' },
    { path: '/chalisa', priority: 0.9, freq: 'monthly' },
    { path: '/gurukul', priority: 0.85, freq: 'monthly' },
    { path: '/itihas', priority: 0.85, freq: 'monthly' },
    { path: '/granth', priority: 0.85, freq: 'monthly' },
    { path: '/parv', priority: 0.85, freq: 'weekly' },
    { path: '/mandir', priority: 0.8, freq: 'monthly' },
    { path: '/sanskar', priority: 0.8, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/privacy', priority: 0.3, freq: 'yearly' },
  ];
  return pages.map(p => ({
    url: `${SITE}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
