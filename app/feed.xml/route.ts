/** RSS feed of cornerstone guides, for feed readers and faster discovery by crawlers. */
export const dynamic = 'force-static';
const SITE = 'https://sanatanparivar.in';
const ITEMS = [
  { p: '/diwali', t: 'दीपावली 2026: तिथि, लक्ष्मी पूजन विधि और कैसे मनाएँ', d: 'दिवाली 2026 8 नवंबर को; पाँच दिन का पर्व, कथाएँ, विधि और सुरक्षा।', date: '2026-11-03' },
  { p: '/sanatan-dharma', t: 'सनातन धर्म क्या है? अर्थ, सिद्धांत और ग्रंथ', d: 'सनातन धर्म का अर्थ और मूल सिद्धांत सरल हिंदी में।', date: '2026-11-03' },
  { p: '/devi-devta', t: 'हिंदू देवी-देवता, दशावतार और 33 कोटि देवता', d: 'त्रिमूर्ति, त्रिदेवी, दशावतार, ज्योतिर्लिंग और चार धाम।', date: '2026-11-03' },
  { p: '/sanatan-virasat', t: 'सनातन विरासत और तीर्थ-विकास', d: 'राम मंदिर, काशी, महाकाल, महाकुंभ और योग दिवस का तथ्यात्मक परिचय।', date: '2026-11-03' },
];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function GET() {
  const items = ITEMS.map(i => `<item><title>${esc(i.t)}</title><link>${SITE}${i.p}</link><guid>${SITE}${i.p}</guid><pubDate>${new Date(i.date).toUTCString()}</pubDate><description>${esc(i.d)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>सनातन परिवार</title><link>${SITE}</link><description>सनातन धर्म, पंचांग, पर्व और तीर्थ की जानकारी</description><language>hi-IN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
