import type { Metadata } from 'next';
import Link from 'next/link';
import { Crumbs, Ld, SacredStrip, SiteFooter, SiteNav, crumbLd } from '../components/SiteChrome';
import { CalendarSearch, calendarSelection } from '../lib/calendar-request';
import { formatHindiDate, getMonthDays } from '../lib/panchang';
import PanchangExplorer from '../panchang/PanchangExplorer';

export const dynamic = 'force-dynamic';
type Props = { searchParams: Promise<CalendarSearch> };
const CRUMBS = [{ href: '/', label: 'मुख्य पृष्ठ' }, { href: '/hindu-calendar', label: 'हिंदू कैलेंडर' }];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const selection = calendarSelection(await searchParams, 'month');
  const month = new Intl.DateTimeFormat('hi-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(`${selection.date}T12:00:00+05:30`));
  const title = `हिंदू कैलेंडर ${month} — तिथि, एकादशी, पूर्णिमा | सनातन परिवार`;
  const description = 'इंटरैक्टिव मासिक हिंदू तिथि कैलेंडर। अपना शहर चुनें, सूर्योदय की तिथियाँ देखें और एकादशी, पूर्णिमा, अमावस्या के खगोलीय संकेत पहचानें। तारीख साझा करें या कैलेंडर में सहेजें।';
  return {
    title, description, alternates: { canonical: '/hindu-calendar' },
    ...(selection.customized ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url: 'https://sanatanparivar.in/hindu-calendar', type: 'website', images: ['/og-parv.jpg'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-parv.jpg'] },
  };
}

export default async function HinduCalendarPage({ searchParams }: Props) {
  const selection = calendarSelection(await searchParams, 'month');
  const signals = getMonthDays(selection.date.slice(0, 7), selection.city).filter(day => day.observances.length > 0);
  return <>
    <Ld data={crumbLd(CRUMBS)} />
    <SacredStrip /><SiteNav active="/hindu-calendar" />
    <main className="art-wrap calendar-page">
      <Crumbs items={CRUMBS} />
      <header className="art-head">
        <p className="art-eyebrow">अपना महीना · अपनी साधना</p>
        <h1 className="art-h1">हिंदू तिथि कैलेंडर</h1>
        <p className="art-lead">महीने की चंद्र तिथियाँ एक नज़र में। शहर चुनें और किसी दिन पर दबाकर सूर्योदय की तिथि व उसका समाप्ति समय देखें।</p>
      </header>
      <PanchangExplorer key={`${selection.date}:${selection.city}`} initialDate={selection.date} initialCity={selection.city} mode="month" />
      <details className="art-sec calendar-method">
        <summary>इस महीने के सूर्योदय तिथि संकेत — पाठ सूची</summary>
        <ul>{signals.map(day => <li key={day.date}><Link href={`/panchang?date=${day.date}&city=${day.city.id}`}>{formatHindiDate(day.date)} — {day.tithi.paksha} {day.tithi.name}</Link></li>)}</ul>
        <p>यह सूची प्रारम्भ में चुने हुए महीने और शहर की है। कैलेंडर के नियंत्रण बदलने पर ऊपर की इंटरैक्टिव सूची देखें।</p>
      </details>
      <section className="art-sec calendar-method">
        <h2 className="art-h2">तिथि कैलेंडर और व्रत कैलेंडर में अंतर</h2>
        <p>किसी तिथि का सूर्योदय पर होना एक खगोलीय सूचना है। एकादशी व्रत में दशमी-विद्धा, स्मार्त–वैष्णव परम्परा और पारण की शर्तें भी देखी जाती हैं। प्रदोष के लिए सूर्यास्त के आसपास की त्रयोदशी चाहिए। इसलिए यहाँ त्रयोदशी का संकेत प्रदोष व्रत की पुष्टि नहीं है।</p>
        <p>कभी एक ही तिथि दो सूर्योदय पर रहती है और कभी दो सूर्योदय के बीच समाप्त हो जाती है। इस दृश्य में केवल सूर्योदय की तिथि दिखती है; लुप्त तिथि महीने में छूट सकती है। यह कैलेंडर ग्रेगोरियन महीनों में तिथि खोजने का उपकरण है, चैत्र–कार्तिक मास या त्योहारों की प्रमाणित सूची नहीं।</p>
        <p><Link href="/panchang#methodology">गणना विधि और सीमाएँ →</Link> · <Link href="/parv">पर्वों का महत्व →</Link></p>
        <p><Link href="/ekadashi">एकादशी</Link> · <Link href="/purnima">पूर्णिमा</Link> · <Link href="/amavasya">अमावस्या</Link> · <Link href="/tithi">तिथि क्या है?</Link></p>
      </section>
    </main>
    <SiteFooter />
  </>;
}
