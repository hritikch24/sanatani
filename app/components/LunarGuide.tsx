import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SacredStrip, SiteNav, SiteFooter, Crumbs, SecOrn, Ld, crumbLd, faqLd, SITE } from './SiteChrome';

type GuidePath = '/tithi' | '/ekadashi' | '/purnima' | '/amavasya';

export type GuideSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type GuideSource = { title: string; href: string; description: string };

const GUIDES: { href: GuidePath; label: string }[] = [
  { href: '/tithi', label: 'तिथि और पक्ष समझें' },
  { href: '/ekadashi', label: 'एकादशी और पारण का अंतर' },
  { href: '/purnima', label: 'पूर्णिमा और पूर्ण चंद्र' },
  { href: '/amavasya', label: 'अमावस्या और नया चंद्र' },
];

export const LUNAR_SOURCES = {
  astronomy: {
    title: 'US Naval Observatory — Calendars, §15.7',
    href: 'https://aa.usno.navy.mil/downloads/c15_usb_online.pdf',
    description: 'तिथि की 12° वाली परिभाषा और सूर्योदय से दिन की गणना; PDF में भारतीय कैलेंडर का खंड।',
  },
  timings: {
    title: 'Drik Panchang — पंचांग के समय कैसे पढ़ें',
    href: 'https://www.drikpanchang.com/faq/faq-ans1.html?lang=en',
    description: 'सूर्योदय पर उपस्थित तिथि, उसके समाप्ति समय और स्थानीय समय की व्याख्या।',
  },
  pac: {
    title: 'Positional Astronomy Centre — राष्ट्रीय पंचांग',
    href: 'https://www.packolkata.gov.in/',
    description: 'भारत मौसम विज्ञान विभाग के केंद्र की राष्ट्रीय पंचांग और Indian Astronomical Ephemeris संबंधी जानकारी।',
  },
  months: {
    title: 'Drik Panchang — अमांत और पूर्णिमांत सेटिंग',
    href: 'https://www.drikpanchang.com/settings/drikpanchang-settings.html?lang=en',
    description: 'चंद्र मास किस तिथि के बाद शुरू होता है और कैलेंडर की पद्धति कैसे चुनें।',
  },
  phases: {
    title: 'NASA — चंद्रमा की कलाएँ',
    href: 'https://science.nasa.gov/moon/moon-phases/',
    description: 'नए चंद्र से पूर्ण चंद्र तक प्रकाशमान भाग और चंद्र चक्र की खगोलीय व्याख्या।',
  },
  eclipses: {
    title: 'NASA — चंद्रमा और ग्रहण',
    href: 'https://science.nasa.gov/moon/eclipses/',
    description: 'हर पूर्णिमा या अमावस्या पर ग्रहण क्यों नहीं होता।',
  },
  ekadashi: {
    title: 'Drik Panchang — एकादशी व्रत की पद्धति',
    href: 'https://www.drikpanchang.com/vrats/ekadashidates.html',
    description: 'शुक्ल और कृष्ण एकादशी तथा स्मार्त और वैष्णव व्रत-दिन का अंतर; अपना नगर चुनकर पढ़ें।',
  },
  parana: {
    title: 'Drik Panchang — एकादशी पारण और हरि वासर',
    href: 'https://www.drikpanchang.com/ekadashis/indira/indira-ekadashi-date-time.html',
    description: 'पारण के नियमों का विवरण; इस संदर्भ में दिखाई गई नगर-विशेष की तारीख को अपने नगर की तारीख न मानें।',
  },
  purnima: {
    title: 'Drik Panchang — पूर्णिमा तिथि और व्रत-दिन',
    href: 'https://www.drikpanchang.com/vrats/purnimasidates.html',
    description: 'पूर्णिमा, पूर्णिमा-व्रत और सत्यनारायण पूजा के दिन अलग होने की स्थिति; स्थानीय विवरण देखें।',
  },
  amavasya: {
    title: 'Drik Panchang — अमावस्या का परिचय',
    href: 'https://www.drikpanchang.com/vrats/amavasyadates.html',
    description: 'कृष्ण पक्ष की अंतिम तिथि और पितृ-स्मरण की परंपरा का संदर्भ; सूची स्थान के अनुसार पढ़ें।',
  },
} satisfies Record<string, GuideSource>;

export function lunarMetadata({ path, title, description }: {
  path: GuidePath;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages: { 'hi-IN': path, 'x-default': path } },
    openGraph: {
      title,
      description,
      url: `${SITE}${path}`,
      siteName: 'सनातन परिवार',
      locale: 'hi_IN',
      type: 'article',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'सनातन परिवार — चंद्र कैलेंडर के हिंदी मार्गदर्शक' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
  };
}

export default function LunarGuide({ path, label, title, symbol, intro, takeaway, sections, faq, sources }: {
  path: GuidePath;
  label: string;
  title: string;
  symbol: string;
  intro: string;
  takeaway: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  sources: GuideSource[];
}) {
  const crumbs = [{ href: '/', label: 'मुख्य पृष्ठ' }, { href: path, label }];

  return (
    <>
      <Ld data={[crumbLd(crumbs), faqLd(faq)]} />
      <SacredStrip />
      <SiteNav />
      <main className="art-wrap">
        <Crumbs items={crumbs} />
        <article aria-labelledby="guide-title">
          <header className="art-head">
            <div className="art-head-om" aria-hidden="true">{symbol}</div>
            <h1 className="art-h1" id="guide-title">{title}</h1>
            <p className="art-lead">{intro}</p>
          </header>

          <aside className="note" aria-label="कैलेंडर की गणना और सीमा">
            <div className="note-label">जानकारी से निर्णय तक</div>
            <p>{takeaway} सनातन परिवार का कैलेंडर खगोलीय गणना पर आधारित अनुमानित जानकारी देता है।
              व्रत-दिन, पूजा-मुहूर्त और पारण के लिए अपने नगर व परंपरा का विश्वसनीय पंचांग देखें।</p>
          </aside>

          <div className="art-grid two">
            <div className="art-card">
              <h2 className="art-h3" style={{ marginTop: 0 }}><Link href="/panchang">आज का पंचांग देखें →</Link></h2>
              <p>दिन की अनुमानित खगोलीय जानकारी को नीचे दिए अर्थ और सीमाओं के साथ पढ़ें।</p>
            </div>
            <div className="art-card">
              <h2 className="art-h3" style={{ marginTop: 0 }}><Link href="/hindu-calendar">हिंदू कैलेंडर देखें →</Link></h2>
              <p>मास के क्रम में तिथियों को समझें; अनुष्ठान की तारीख स्थानीय पंचांग से मिलाएँ।</p>
            </div>
          </div>

          <nav className="toc" aria-label={`${label} की विषय सूची`}>
            <h2 className="toc-title">इस मार्गदर्शक में</h2>
            <ol>
              {sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
              <li><a href="#questions">सामान्य प्रश्न</a></li>
              <li><a href="#sources">स्रोत और आगे की जाँच</a></li>
            </ol>
          </nav>

          {sections.map(section => (
            <section className="art-sec" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 className="art-h2" id={`${section.id}-title`}>{section.title}</h2>
              {section.content}
            </section>
          ))}

          <section className="art-sec art-faq" id="questions" aria-labelledby="questions-title">
            <h2 className="art-h2" id="questions-title">{label}: सामान्य प्रश्न</h2>
            {faq.map(answer => (
              <details key={answer.q}>
                <summary>{answer.q}</summary>
                <p>{answer.a}</p>
              </details>
            ))}
          </section>

          <section className="art-sec" id="sources" aria-labelledby="sources-title">
            <h2 className="art-h2" id="sources-title">स्रोत और आगे की जाँच</h2>
            <p className="art-p">खगोलीय परिभाषाओं और पंचांग पढ़ने की पद्धति के लिए ये संदर्भ उपयोगी हैं।
              अनुष्ठान संबंधी विवरण उस स्रोत की परंपरा के अनुसार पढ़ें। स्रोतों की जाँच: <time dateTime="2026-10-04">4 अक्टूबर 2026</time>।</p>
            <ul className="art-ul">
              {sources.map(source => <li key={source.href}><a href={source.href}>{source.title}</a> — {source.description}</li>)}
            </ul>
          </section>
        </article>

        <nav className="related" aria-label="चंद्र कैलेंडर के अन्य मार्गदर्शक">
          <SecOrn sym="✦" />
          <h2 className="related-title">चंद्र कैलेंडर को और समझें</h2>
          <div className="related-grid">
            {GUIDES.filter(guide => guide.href !== path).map(guide => (
              <Link key={guide.href} href={guide.href} className="related-card">{guide.label}</Link>
            ))}
            <Link href="/parv" className="related-card">पर्वों का सांस्कृतिक परिचय</Link>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
