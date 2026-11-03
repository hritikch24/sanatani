import Link from 'next/link';
import { SacredStrip, SiteNav, SiteFooter, Crumbs, SecOrn, JoinBand, RelatedLinks, Ld, articleLd, crumbLd, faqLd } from './SiteChrome';
import AdSlot from './AdSlot';

export type Sec = {
  id: string; title: string;
  paras?: string[]; bullets?: string[]; cards?: { t: string; p: string }[];
  shloka?: { s: string; m: string; r: string };
  links?: { href: string; label: string }[];
};
export type ArticleData = {
  path: string; navLabel: string; h1: string; lead: string; headline: string; desc: string; section: string;
  modified: string; extraLd?: object[]; sections: Sec[]; faq: { q: string; a: string }[]; note?: string;
};

export function Article({ d }: { d: ArticleData }) {
  const crumbs = [{ href: '/', label: 'मुख्य पृष्ठ' }, { href: d.path, label: d.navLabel }];
  return (
    <>
      <Ld data={[articleLd({ slug: d.path, headline: d.headline, description: d.desc, section: d.section, modified: d.modified }), crumbLd(crumbs), faqLd(d.faq), ...(d.extraLd ?? [])]} />
      <SacredStrip />
      <SiteNav active={d.path} />
      <main className="art-wrap">
        <Crumbs items={crumbs} />
        <header className="art-head">
          <div className="art-head-om">ॐ</div>
          <h1 className="art-h1">{d.h1}</h1>
          <p className="art-lead">{d.lead}</p>
        </header>
        <nav className="art-card" aria-label="इस पृष्ठ की विषय-सूची" style={{ marginBottom: '1.5rem' }}>
          <h2 className="art-h2" style={{ fontSize: '1.05rem', marginTop: 0 }}>विषय-सूची</h2>
          <ol className="art-ul">{d.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol>
        </nav>
        {d.sections.map((s, i) => (
          <div key={s.id}>
            <section className="art-sec" id={s.id}>
              <h2 className="art-h2">{s.title}</h2>
              {s.paras?.map((p, j) => <p className="art-p" key={j}>{p}</p>)}
              {s.bullets && <ul className="art-ul">{s.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
              {s.cards && <div className="art-grid two">{s.cards.map(c => <div className="art-card" key={c.t}><h3>{c.t}</h3><p>{c.p}</p></div>)}</div>}
              {s.shloka && <div className="shl-box"><div className="sk">{s.shloka.s}</div><div className="mn">{s.shloka.m}</div><div className="sr">— {s.shloka.r}</div></div>}
              {s.links && <p className="art-p">{s.links.map((l, j) => <span key={l.href}>{j > 0 && ' · '}<Link href={l.href}>{l.label}</Link></span>)}</p>}
            </section>
            {i === 1 && <AdSlot />}
          </div>
        ))}
        {d.note && <p className="art-p" style={{ fontSize: '.85rem', opacity: .8 }}>{d.note}</p>}
        <JoinBand />
        <section className="art-sec art-faq" id="prashn">
          <SecOrn sym="ॐ" />
          <h2 className="art-h2">अक्सर पूछे जाने वाले प्रश्न</h2>
          {d.faq.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </section>
        <AdSlot />
        <RelatedLinks exclude={d.path} />
      </main>
      <SiteFooter />
    </>
  );
}

export function articleMeta(d: Pick<ArticleData, 'path' | 'headline' | 'desc'> & { title: string; keywords: string[] }) {
  return {
    title: d.title,
    description: d.desc,
    keywords: d.keywords,
    alternates: { canonical: d.path },
    openGraph: {
      title: d.headline, description: d.desc, url: `https://sanatanparivar.in${d.path}`, type: 'article' as const,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: d.headline }],
    },
  };
}
