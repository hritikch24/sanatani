import type { Metadata } from 'next';
import Link from 'next/link';
import { SacredStrip, SiteNav, SiteFooter, NAV } from './components/SiteChrome';

export const metadata: Metadata = {
  title: 'पृष्ठ नहीं मिला — 404 | सनातन परिवार',
  description: 'यह पृष्ठ उपलब्ध नहीं है। सनातन परिवार के अन्य पृष्ठ देखें — इतिहास, गुरुकुल, ग्रंथ, पर्व एवं तीर्थ।',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SacredStrip />
      <SiteNav />
      <main className="art-wrap">
        <header className="art-head">
          <div className="art-head-om">ॐ</div>
          <h1 className="art-h1">यह पृष्ठ नहीं मिला</h1>
          <p className="art-lead">
            जिस पृष्ठ की आप खोज कर रहे हैं वह यहाँ नहीं है। कोई बात नहीं — नीचे से अपनी यात्रा
            जारी रखें।
          </p>
        </header>
        <div className="related-grid" style={{ marginBottom: '2rem' }}>
          {NAV.map(n => <Link key={n.href} href={n.href} className="related-card">{n.label}</Link>)}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
