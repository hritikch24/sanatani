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
  keywords: ['सनातन परिवार', 'सनातन धर्म', 'हिंदू समुदाय', 'sanatan parivar', 'hindu community', 'sanatan dharma', 'digital hindu identity', 'daily shloka', 'bhagavad gita', 'सनातनी पहचान', 'हिंदू पहचान पत्र', 'सनातन परिवार रजिस्ट्रेशन', 'गीता श्लोक', 'आज का श्लोक', 'हिंदू धर्म', 'भगवद गीता', 'हिंदू संस्कृति', 'वेद उपनिषद', 'सनातन संस्कृति', 'हिंदू एकता', 'धर्म रक्षा', 'sanatan dharma registration', 'hindu identity card', 'free hindu membership', 'bhagavad gita shloka hindi', 'daily mantra hindi', 'hindu organization india'],
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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'सनातन परिवार',
  alternateName: ['Sanatan Parivar', 'SanatanParivar'],
  url: 'https://sanatanparivar.in',
  inLanguage: ['hi', 'en'],
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://sanatanparivar.in/shloka',
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'मुख्य पृष्ठ', item: 'https://sanatanparivar.in' },
    { '@type': 'ListItem', position: 2, name: 'दैनिक श्लोक', item: 'https://sanatanparivar.in/shloka' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'सनातन परिवार क्या है?', acceptedAnswer: { '@type': 'Answer', text: 'सनातन परिवार भारत का सबसे बड़ा सनातनी डिजिटल समुदाय है। यहाँ आप निःशुल्क सदस्यता लेकर अपनी सनातनी पहचान पा सकते हैं, प्रतिदिन गीता के श्लोक पढ़ सकते हैं, और लाखों सनातनियों से जुड़ सकते हैं।' } },
    { '@type': 'Question', name: 'सनातन परिवार में कैसे जुड़ें?', acceptedAnswer: { '@type': 'Answer', text: 'SanatanParivar.in पर जाएं, "अभी जुड़ें" बटन दबाएं, अपना नाम भरें और 30 सेकंड में निःशुल्क सदस्यता पाएं। आपको तुरंत डिजिटल पहचान पत्र मिलेगा।' } },
    { '@type': 'Question', name: 'क्या सनातन परिवार की सदस्यता निःशुल्क है?', acceptedAnswer: { '@type': 'Answer', text: 'हाँ, सनातन परिवार की सदस्यता पूर्णतः निःशुल्क है और सदा रहेगी। कोई छिपा शुल्क नहीं है।' } },
    { '@type': 'Question', name: 'सनातन परिवार का पहचान पत्र क्या है?', acceptedAnswer: { '@type': 'Answer', text: 'यह एक डिजिटल सामुदायिक पहचान पत्र है जो आपके सनातन परिवार की सदस्यता को दर्शाता है। इसमें आपका नाम, सदस्य संख्या और तिथि होती है। आप इसे डाउनलोड और WhatsApp पर शेयर कर सकते हैं। यह शासकीय दस्तावेज़ नहीं है।' } },
    { '@type': 'Question', name: 'आज का श्लोक कहाँ पढ़ें?', acceptedAnswer: { '@type': 'Answer', text: 'SanatanParivar.in पर प्रतिदिन भगवद् गीता, उपनिषद् और वेदों से एक नया श्लोक अर्थ सहित प्रकाशित होता है। आप इसे WhatsApp पर भी शेयर कर सकते हैं।' } },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
