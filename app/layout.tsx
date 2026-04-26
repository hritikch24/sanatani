import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#8B0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'सनातन परिवार — हिंदू समुदाय की डिजिटल पहचान | Sanatan Parivar',
  description: 'सनातन परिवार — भारत का सबसे बड़ा सनातनी डिजिटल समुदाय। निःशुल्क सदस्यता लें, सनातनी पहचान पाएं, दैनिक श्लोक पढ़ें। Join India\'s largest Sanatani digital community. Free membership, daily shlokas, digital ID card.',
  keywords: ['सनातन परिवार', 'सनातन धर्म', 'हिंदू समुदाय', 'sanatan parivar', 'hindu community', 'sanatan dharma', 'digital hindu identity', 'daily shloka', 'bhagavad gita', 'सनातनी पहचान', 'हिंदू पहचान पत्र', 'सनातन परिवार रजिस्ट्रेशन'],
  manifest: '/manifest.json',
  metadataBase: new URL('https://sanatanparivar.in'),
  alternates: { canonical: '/', languages: { 'hi-IN': '/', 'en-IN': '/' } },
  openGraph: {
    title: 'सनातन परिवार — हिंदू समुदाय की डिजिटल पहचान',
    description: 'भारत का सबसे बड़ा सनातनी डिजिटल समुदाय। निःशुल्क सदस्यता लें, सनातनी पहचान पाएं।',
    url: 'https://sanatanparivar.in',
    siteName: 'सनातन परिवार | Sanatan Parivar',
    locale: 'hi_IN',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'सनातन परिवार — Sanatan Parivar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'सनातन परिवार — हिंदू समुदाय की डिजिटल पहचान',
    description: 'भारत का सबसे बड़ा सनातनी डिजिटल समुदाय। निःशुल्क सदस्यता।',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'सनातन परिवार' },
  other: { 'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'सनातन परिवार',
  alternateName: 'Sanatan Parivar',
  url: 'https://sanatanparivar.in',
  logo: 'https://sanatanparivar.in/icon.svg',
  description: 'भारत का सबसे बड़ा सनातनी डिजिटल समुदाय — निःशुल्क सदस्यता, दैनिक श्लोक, सनातनी पहचान',
  foundingDate: '2026',
  sameAs: [],
  contactPoint: { '@type': 'ContactPoint', email: 'contact@sanatanparivar.in', contactType: 'customer service', availableLanguage: ['Hindi', 'English'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
