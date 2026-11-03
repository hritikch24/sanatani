import Link from 'next/link';
import AdSlot from './AdSlot';

export const SITE = 'https://sanatanparivar.in';

export const NAV = [
  { href: '/', label: 'मुख्य पृष्ठ' },
  { href: '/panchang', label: 'आज का पंचांग' },
  { href: '/hindu-calendar', label: 'हिंदू कैलेंडर' },
  { href: '/upasthiti', label: 'सनातन उपस्थिति' },
  { href: '/sanatan-dharma', label: 'सनातन धर्म क्या है' },
  { href: '/itihas', label: 'सनातन का इतिहास' },
  { href: '/devi-devta', label: 'देवी-देवता' },
  { href: '/sanatan-virasat', label: 'सनातन विरासत' },
  { href: '/gurukul', label: 'गुरुकुल परम्परा' },
  { href: '/granth', label: 'ग्रंथ' },
  { href: '/chalisa', label: 'हनुमान चालीसा' },
  { href: '/mandir', label: 'तीर्थ एवं मंदिर' },
  { href: '/sanskar', label: '16 संस्कार' },
  { href: '/diwali', label: 'दीपावली 2026' },
  { href: '/parv', label: 'पर्व एवं त्योहार' },
  { href: '/shloka', label: 'दैनिक श्लोक' },
];

export function SacredStrip() {
  return <div className="sacred-strip">ॐ नमः शिवाय &nbsp;✦&nbsp; जय श्री राम &nbsp;✦&nbsp; हर हर महादेव</div>;
}

export function SiteNav({ active }: { active?: string }) {
  return (
    <nav className="site-nav" aria-label="मुख्य नेविगेशन">
      <div className="site-nav-inner">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} aria-current={active === n.href ? 'page' : undefined} className={`site-nav-link${active === n.href ? ' active' : ''}`}>
            {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Crumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav className="crumbs" aria-label="ब्रेडक्रम्ब">
      {items.map((it, i) => (
        <span key={it.href}>
          {i > 0 && <span className="crumb-sep">›</span>}
          {i === items.length - 1
            ? <span aria-current="page">{it.label}</span>
            : <Link href={it.href}>{it.label}</Link>}
        </span>
      ))}
    </nav>
  );
}

export function SecOrn({ sym = 'ॐ' }: { sym?: string }) {
  return <div className="sec-orn"><div className="bar" /><div className="sym">{sym}</div><div className="bar r" /></div>;
}

export function JoinBand({
  title = 'सनातन परिवार से जुड़ें',
  text = 'निःशुल्क सदस्यता लें, अपना सनातनी डिजिटल पहचान पत्र पाएं और प्रतिदिन एक श्लोक अपने WhatsApp पर साझा करें।',
}: { title?: string; text?: string }) {
  return (
    <>
    <AdSlot />
    <aside className="cta-band">
      <div className="cta-band-om">ॐ</div>
      <h2 className="cta-band-title">{title}</h2>
      <p className="cta-band-text">{text}</p>
      <Link href="/" className="cta-band-btn">🙏 अभी जुड़ें — सदा के लिए निःशुल्क</Link>
    </aside>
    </>
  );
}

export function RelatedLinks({ exclude }: { exclude: string }) {
  const rest = NAV.filter(n => n.href !== exclude && n.href !== '/');
  return (
    <section className="related">
      <SecOrn sym="✦" />
      <h2 className="related-title">आगे पढ़ें</h2>
      <div className="related-grid">
        {rest.map(n => (
          <Link key={n.href} href={n.href} className="related-card">{n.label}</Link>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-om">ॐ</div>
      <div className="ornament"><div className="ln" /><div className="dt" /><div className="dm" /><div className="dt" /><div className="ln" /></div>
      <div className="footer-nav">
        {NAV.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}
      </div>
      <div className="footer-links">
        <Link href="/about">हमारे बारे में</Link>
        <Link href="/privacy">गोपनीयता नीति</Link>
        <a href="mailto:contact@sanatanparivar.in">संपर्क</a>
      </div>
      <div className="footer-copy">
        © सनातन परिवार 2026<br />भारत में निर्मित 🇮🇳<br />
        <span style={{ fontSize: '.7rem', opacity: .5 }}>जय हिन्द · वन्दे मातरम्</span>
      </div>
    </footer>
  );
}

export function Ld({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function articleLd(o: {
  slug: string; headline: string; description: string; section: string; modified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: o.headline,
    description: o.description,
    inLanguage: 'hi',
    articleSection: o.section,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${o.slug}` },
    datePublished: '2026-08-29',
    dateModified: o.modified,
    author: { '@type': 'Organization', name: 'सनातन परिवार', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'सनातन परिवार',
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` },
    },
    image: `${SITE}/og-image.jpg`,
  };
}

export function crumbLd(items: { href: string; label: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.label, item: `${SITE}${it.href}`,
    })),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(x => ({
      '@type': 'Question', name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };
}
