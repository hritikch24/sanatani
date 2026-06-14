import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'सनातन परिवार के बारे में — हिंदू समुदाय, सनातन धर्म, भारतीय संस्कृति | About Sanatan Parivar',
  description: 'सनातन परिवार — भारत का सबसे बड़ा सनातनी डिजिटल समुदाय। जानें हमारी दृष्टि, लक्ष्य और सनातन धर्म की रक्षा का संकल्प। About Sanatan Parivar — India\'s largest Hindu digital community.',
  keywords: ['सनातन परिवार के बारे में', 'सनातन धर्म क्या है', 'हिंदू संगठन', 'hindu organization', 'about sanatan parivar', 'सनातन धर्म का महत्व', 'हिंदू समुदाय भारत', 'भारतीय संस्कृति'],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'सनातन परिवार के बारे में — हिंदू समुदाय की डिजिटल पहचान',
    description: 'भारत का सबसे बड़ा सनातनी डिजिटल समुदाय। जानें हमारी दृष्टि, लक्ष्य और संकल्प।',
    url: 'https://sanatanparivar.in/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="sacred-strip">ॐ नमः शिवाय &nbsp;✦&nbsp; जय श्री राम &nbsp;✦&nbsp; हर हर महादेव</div>
      <main style={{ padding: '2rem 1.25rem 4rem', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--deva)', fontSize: '2rem', color: 'var(--gd)', marginBottom: '.5rem' }}>ॐ</div>
          <h1 style={{ fontFamily: 'var(--deva)', fontSize: 'clamp(1.4rem,5vw,2rem)', color: 'var(--mr)', lineHeight: 1.5, marginBottom: '.75rem' }}>
            सनातन परिवार के बारे में
          </h1>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            भारत का सबसे बड़ा सनातनी डिजिटल समुदाय
          </p>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--deva)', fontSize: '1.3rem', color: 'var(--mr)', marginBottom: '.75rem' }}>🕉️ सनातन परिवार क्या है?</h2>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '1rem' }}>
            सनातन परिवार एक डिजिटल सनातनी समुदाय है जो भारत के हर कोने से हिंदुओं को एक मंच पर जोड़ता है। यहाँ जाति, भाषा और क्षेत्र से परे — हर सनातनी को एक डिजिटल पहचान मिलती है। हमारा विश्वास है कि सनातन धर्म केवल एक धर्म नहीं, बल्कि एक जीवन पद्धति है जो हजारों वर्षों से भारतीय संस्कृति की नींव रही है।
          </p>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9 }}>
            सनातन परिवार की सदस्यता पूर्णतः निःशुल्क है। आप 30 सेकंड में अपना नाम दर्ज करके अपना सनातनी पहचान पत्र प्राप्त कर सकते हैं, प्रतिदिन भगवद् गीता और उपनिषदों के श्लोक पढ़ सकते हैं, और लाखों सनातनियों के इस परिवार का हिस्सा बन सकते हैं।
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--deva)', fontSize: '1.3rem', color: 'var(--mr)', marginBottom: '.75rem' }}>🔱 हमारी दृष्टि</h2>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9 }}>
            प्रत्येक सनातनी को एक डिजिटल पहचान प्रदान करना। एक ऐसा मंच बनाना जहाँ हर हिंदू गर्व से कहे — &ldquo;मैं सनातनी हूं।&rdquo; हमारा लक्ष्य एक करोड़ सनातनियों को इस परिवार से जोड़ना है — वसुधैव कुटुम्बकम्।
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--deva)', fontSize: '1.3rem', color: 'var(--mr)', marginBottom: '.75rem' }}>🎯 हमारा लक्ष्य</h2>
          <ul style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 2.2, paddingLeft: '1.25rem' }}>
            <li>सनातन धर्म के ज्ञान को डिजिटल माध्यम से हर घर तक पहुँचाना</li>
            <li>भगवद् गीता, उपनिषद् और वेदों के श्लोक प्रतिदिन साझा करना</li>
            <li>हिंदू एकता और सांस्कृतिक गौरव को बढ़ावा देना</li>
            <li>आने वाली पीढ़ी को सनातन मूल्यों से जोड़ना</li>
            <li>धर्म, सेवा, ज्ञान, अहिंसा और राष्ट्र-भक्ति के मूल्यों का प्रसार</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--deva)', fontSize: '1.3rem', color: 'var(--mr)', marginBottom: '.75rem' }}>📖 सनातन धर्म का महत्व</h2>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '1rem' }}>
            सनातन धर्म विश्व का सबसे प्राचीन धर्म है। वेद, उपनिषद्, भगवद् गीता, रामायण और महाभारत — इन ग्रंथों में जीवन के हर पहलू का मार्गदर्शन मिलता है। &ldquo;सत्यमेव जयते&rdquo;, &ldquo;वसुधैव कुटुम्बकम्&rdquo;, &ldquo;अहिंसा परमो धर्मः&rdquo; — ये सनातन धर्म के वे सिद्धांत हैं जो आज भी उतने ही प्रासंगिक हैं।
          </p>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9 }}>
            सनातन परिवार इन्हीं मूल्यों को डिजिटल युग में आगे बढ़ाने का एक प्रयास है। हम चाहते हैं कि हर भारतीय, चाहे वह दिल्ली में हो या तमिलनाडु में, उत्तर प्रदेश में हो या गुजरात में — सनातन धर्म के इस दिव्य ज्ञान से जुड़ा रहे।
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--deva)', fontSize: '1.3rem', color: 'var(--mr)', marginBottom: '.75rem' }}>🙏 कैसे जुड़ें?</h2>
          <p style={{ fontFamily: 'var(--deva)', fontSize: '.95rem', color: 'var(--muted)', lineHeight: 1.9 }}>
            सनातन परिवार से जुड़ना बिलकुल आसान और निःशुल्क है। बस <a href="/" style={{ color: 'var(--sf)', textDecoration: 'none', fontWeight: 600 }}>sanatanparivar.in</a> पर जाएं, &ldquo;अभी जुड़ें&rdquo; बटन दबाएं, अपना नाम भरें — और 30 सेकंड में आपका सनातनी पहचान पत्र तैयार! इसे डाउनलोड करें, WhatsApp पर शेयर करें, और अपने परिवार-मित्रों को भी जोड़ें।
          </p>
        </section>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/" style={{
            display: 'inline-block', fontFamily: 'var(--deva)', fontSize: '1.1rem',
            background: 'linear-gradient(135deg,var(--sf),#CC4400)', color: '#fff',
            border: 'none', borderRadius: 12, padding: '.85rem 2.5rem', textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(255,107,0,.35)',
          }}>
            🙏 अभी जुड़ें — निःशुल्क
          </a>
        </div>
      </main>
      <footer style={{
        background: 'linear-gradient(180deg,var(--dmr),#3a0008)', color: 'var(--cr)',
        textAlign: 'center', padding: '2rem 1.25rem 1.5rem', fontFamily: 'var(--deva)',
        borderTop: '3px solid var(--gd)',
      }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--gd)', opacity: .6, marginBottom: '.5rem' }}>ॐ</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '.75rem', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: 'var(--gl)', textDecoration: 'none', fontSize: '.9rem' }}>मुख्य पृष्ठ</a>
          <a href="/shloka" style={{ color: 'var(--gl)', textDecoration: 'none', fontSize: '.9rem' }}>दैनिक श्लोक</a>
          <a href="/privacy" style={{ color: 'var(--gl)', textDecoration: 'none', fontSize: '.9rem' }}>गोपनीयता नीति</a>
        </div>
        <div style={{ fontSize: '.8rem', opacity: .6, lineHeight: 2 }}>© सनातन परिवार 2026<br/>भारत में निर्मित 🇮🇳</div>
      </footer>
    </>
  );
}
