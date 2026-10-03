import type { Metadata, Viewport } from 'next';
import { Tiro_Devanagari_Hindi, Inter } from 'next/font/google';
import { Suspense } from 'react';
import Track from './components/Track';
import { Ld, NAV, SITE } from './components/SiteChrome';
import './globals.css';


const deva = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--font-deva',
  preload: true,
});

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-en',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#8B0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'आज का पंचांग, तिथि और हिंदू कैलेंडर | सनातन परिवार',
  description: 'दैनिक पंचांग में तिथि, पक्ष और सूर्योदय-सूर्यास्त देखें। हिंदू कैलेंडर, हिंदी अर्थ सहित श्लोक और हिंदू संस्कृति, ग्रंथ व परम्पराओं का परिचय पाएं।',
  manifest: '/manifest.json',
  authors: [{ name: 'सनातन परिवार', url: 'https://sanatanparivar.in' }],
  creator: 'सनातन परिवार',
  publisher: 'सनातन परिवार',
  category: 'religion',
  formatDetection: { telephone: false, address: false, email: false },
  metadataBase: new URL('https://sanatanparivar.in'),
  alternates: { canonical: './' },
  openGraph: {
    url: './',
    siteName: 'सनातन परिवार | Sanatan Parivar',
    locale: 'hi_IN',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'सनातन परिवार — ॐ' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'सनातन परिवार' },
  // Set GOOGLE_SITE_VERIFICATION in the environment to verify in Search Console.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'सनातन परिवार',
  alternateName: 'Sanatan Parivar',
  url: 'https://sanatanparivar.in',
  logo: 'https://sanatanparivar.in/icon.svg',
  description: 'दैनिक तिथि और पक्ष, हिंदू कैलेंडर, हिंदी अर्थ सहित श्लोक और हिंदू संस्कृति का परिचय।',
  sameAs: [],
  contactPoint: { '@type': 'ContactPoint', email: 'contact@sanatanparivar.in', contactType: 'customer service', availableLanguage: ['Hindi', 'English'] },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'सनातन परिवार',
  alternateName: ['Sanatan Parivar', 'SanatanParivar'],
  url: 'https://sanatanparivar.in',
  inLanguage: ['hi', 'en'],
};

const siteNavJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'सनातन परिवार — विषय सूची',
  itemListElement: NAV.map(({ label, href }, index) => ({
    '@type': 'ListItem', position: index + 1, name: label, url: `${SITE}${href}`,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" dir="ltr" className={`${deva.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Ld data={[jsonLd, websiteJsonLd, siteNavJsonLd]} />
      </head>
      <body>
        {children}
        <Suspense fallback={null}><Track /></Suspense>
      </body>
    </html>
  );
}
