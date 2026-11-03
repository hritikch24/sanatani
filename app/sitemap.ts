import type { MetadataRoute } from 'next';

const SITE = 'https://sanatanparivar.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, freq: 'daily' },
    { path: '/panchang', priority: 0.9, freq: 'daily' },
    { path: '/hindu-calendar', priority: 0.9, freq: 'daily' },
    { path: '/tithi', priority: 0.8, freq: 'monthly' },
    { path: '/ekadashi', priority: 0.8, freq: 'monthly' },
    { path: '/purnima', priority: 0.8, freq: 'monthly' },
    { path: '/amavasya', priority: 0.8, freq: 'monthly' },
    { path: '/upasthiti', priority: 0.9, freq: 'hourly' },
    { path: '/shloka', priority: 0.9, freq: 'monthly' },
    { path: '/chalisa', priority: 0.9, freq: 'monthly' },
    { path: '/gurukul', priority: 0.85, freq: 'monthly' },
    { path: '/sanatan-dharma', priority: 0.95, freq: 'monthly' },
    { path: '/sanatan-virasat', priority: 0.9, freq: 'monthly' },
    { path: '/devi-devta', priority: 0.85, freq: 'monthly' },
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
    lastModified: new Date('2026-11-03'),
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
