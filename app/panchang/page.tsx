import type { Metadata } from 'next';
import Link from 'next/link';
import { Crumbs, Ld, SacredStrip, SiteFooter, SiteNav, crumbLd, faqLd } from '../components/SiteChrome';
import { CalendarSearch, calendarSelection } from '../lib/calendar-request';
import { formatHindiDate, getIndiaDate, getPanchang } from '../lib/panchang';
import PanchangExplorer from './PanchangExplorer';

export const dynamic = 'force-dynamic';
type Props = { searchParams: Promise<CalendarSearch> };
const CRUMBS = [{ href: '/', label: 'मुख्य पृष्ठ' }, { href: '/panchang', label: 'आज की तिथि' }];
const FAQ = [
  { q: 'आज की हिंदू तिथि कैसे देखें?', a: 'अपना शहर और दिन चुनें। यह कैलेंडर उस स्थान के सूर्योदय पर सूर्य और चंद्रमा के कोणीय अंतर से तिथि निकालता है। तिथि समाप्ति का अनुमानित समय भी भारतीय मानक समय में दिखाया जाता है।' },
  { q: 'क्या यहाँ दी गई तिथि पूरे दिन रहती है?', a: 'नहीं। तिथि आधी रात पर नहीं, सूर्य और चंद्रमा के बीच कोणीय अंतर के प्रत्येक 12 डिग्री बढ़ने पर बदलती है। यहाँ प्रमुख तिथि सूर्योदय की है; दिन में समाप्ति समय के बाद अगली तिथि शुरू हो सकती है।' },
  { q: 'क्या इस कैलेंडर से व्रत का पारण या मुहूर्त तय कर सकते हैं?', a: 'यह सीमित खगोलीय तिथि कैलेंडर है, पूर्ण धार्मिक पंचांग नहीं। इसमें नक्षत्र, योग, करण, मुहूर्त और पारण की गणना नहीं है। व्रत तथा पूजा का अंतिम निर्णय स्थानीय मान्य पंचांग और अपनी परम्परा के अनुसार करें।' },
];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const selection = calendarSelection(await searchParams, 'day');
  const day = getPanchang(selection.date, selection.city);
  const title = `आज की तिथि व पंचांग — ${formatHindiDate(day.date)} | सनातन परिवार`;
  const description = `${day.city.name} में ${formatHindiDate(day.date)} के सूर्योदय पर ${day.tithi.paksha} ${day.tithi.name}। शहर चुनकर तिथि समाप्ति, सूर्योदय, सूर्यास्त और मासिक हिंदू कैलेंडर देखें।`;
  return {
    title, description, alternates: { canonical: '/panchang' },
    ...(selection.customized ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url: 'https://sanatanparivar.in/panchang', type: 'website', images: ['/og-parv.jpg'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-parv.jpg'] },
  };
}

export default async function PanchangPage({ searchParams }: Props) {
  const selection = calendarSelection(await searchParams, 'day');
  const day = getPanchang(selection.date, selection.city);
  const isToday = day.date === getIndiaDate();
  return <>
    <Ld data={[crumbLd(CRUMBS), faqLd(FAQ)]} />
    <SacredStrip /><SiteNav active="/panchang" />
    <main className="art-wrap calendar-page">
      <Crumbs items={CRUMBS} />
      <header className="art-head">
        <p className="art-eyebrow">दैनिक साधना · खगोलीय तिथि कैलेंडर</p>
        <h1 className="art-h1">{isToday ? 'आज की तिथि व पंचांग' : 'तिथि व पंचांग'}</h1>
        <p className="art-lead">अपने शहर के सूर्योदय की तिथि, पक्ष और तिथि समाप्ति देखें। दिन या शहर बदलकर विवरण खोजें; सभी समय भारतीय मानक समय (IST) में हैं।</p>
      </header>
      <PanchangExplorer key={`${selection.date}:${selection.city}`} initialDate={selection.date} initialCity={selection.city} />
      <section className="art-sec calendar-method" id="methodology">
        <h2 className="art-h2">यह तिथि कैसे निकाली गई है?</h2>
        <p>तिथि सूर्य और चंद्रमा की भूकेन्द्रीय क्रान्तिवृत्तीय देशान्तर दूरी के प्रत्येक 12° खंड से बनती है। गणना चुने हुए शहर के सूर्योदय पर की जाती है; सूर्योदय उपलब्ध न हो तो सुबह 06:00 IST लिया जाता है। समय भारतीय मानक समय (Asia/Kolkata) में हैं।</p>
        <p>गणना <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer">Astronomy Engine</a> के सूर्य–चंद्र मॉडल से स्थानीय रूप से होती है। सूर्योदय में मानक वायुमण्डलीय अपवर्तन और समुद्र-तल ऊँचाई मानी गई है; वास्तविक क्षितिज, मौसम और ऊँचाई से अंतर आ सकता है। मिनट तक दिखाए गए समय अनुमानित हैं।</p>
        <p>यह पूर्ण धार्मिक पंचांग नहीं है। नक्षत्र, योग, करण, चंद्र मास, पर्व-निर्णय, मुहूर्त और व्रत-पारण यहाँ नहीं निकाले जाते। एकादशी या पूर्णिमा का तिथि संकेत स्वतः व्रत का दिन नहीं बताता। पूजा और व्रत के लिए <a href="https://www.drikpanchang.com/panchang/day-panchang.html" target="_blank" rel="noopener noreferrer">स्थान-आधारित मान्य पंचांग</a> से पुष्टि करें।</p>
        <p><Link href="/tithi">तिथि और पक्ष को समझें →</Link> · <Link href="/hindu-calendar">महीने की सभी तिथियाँ देखें →</Link></p>
      </section>
      <section className="faq-sec">
        <h2 className="faq-title">तिथि से जुड़े प्रश्न</h2>
        <div className="faq-list">{FAQ.map(item => <details className="faq-item" key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
