import type { MetadataRoute } from 'next';

/**
 * AI answer engines (ChatGPT, Perplexity, Claude, Google AI Overviews) can only
 * cite what they are allowed to crawl. We explicitly welcome them — being quoted
 * in an AI answer is now a real traffic and authority channel, not a leak.
 */
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-Web', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
  'CCBot', 'Bytespider', 'Amazonbot', 'meta-externalagent',
  'cohere-ai', 'YouBot', 'Diffbot', 'omgili',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_CRAWLERS.map(ua => ({ userAgent: ua, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: 'https://sanatanparivar.in/sitemap.xml',
    host: 'https://sanatanparivar.in',
  };
}
