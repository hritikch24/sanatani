import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'गोपनीयता नीति | सनातन परिवार' };

const S: React.CSSProperties = { marginBottom: '1.5rem' };
const H: React.CSSProperties = { fontSize: '1.1rem', color: '#800020', marginBottom: '.5rem', fontFamily: "'Tiro Devanagari Hindi', serif" };

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem 6rem', fontFamily: "'Inter', sans-serif", color: '#1a0500', lineHeight: 1.7 }}>
      <a href="/" style={{ color: '#DAA520', textDecoration: 'none', fontSize: '.9rem' }}>← वापस जाएं</a>

      <h1 style={{ fontSize: 'clamp(1.5rem,5vw,2rem)', color: '#800020', margin: '1.5rem 0 .4rem', fontFamily: "'Tiro Devanagari Hindi', serif" }}>
        गोपनीयता नीति
      </h1>
      <h2 style={{ fontSize: '1.1rem', color: '#888', fontWeight: 400, marginBottom: '2rem' }}>Privacy Policy</h2>
      <p style={{ ...S, fontSize: '.82rem', color: '#aaa' }}>अंतिम अपडेट: अप्रैल 2026 | Last updated: April 2026</p>

      <div style={S}>
        <h3 style={H}>1. हम क्या डेटा एकत्र करते हैं / Data We Collect</h3>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>नाम (अनिवार्य) / Name (required)</li>
          <li>शहर (वैकल्पिक) / City (optional)</li>
          <li>गोत्र (वैकल्पिक) / Gotra (optional)</li>
          <li>पंजीकरण तिथि / Registration timestamp</li>
        </ul>
      </div>

      <div style={S}>
        <h3 style={H}>2. उपयोग का उद्देश्य / Purpose of Use</h3>
        <p>सामुदायिक सदस्यता निर्देशिका और व्यक्तिगत आध्यात्मिक सामग्री प्रदान करना।</p>
        <p>Community membership directory and personalized spiritual content delivery.</p>
      </div>

      <div style={S}>
        <h3 style={H}>3. डेटा साझाकरण / Data Sharing</h3>
        <p><strong>हम आपका डेटा किसी तीसरे पक्ष को नहीं बेचते।</strong></p>
        <p>We do not sell or share your personal data with any third party.</p>
      </div>

      <div style={S}>
        <h3 style={H}>4. महत्वपूर्ण सूचना / Important Notice</h3>
        <p><strong>यह पहचान पत्र शासकीय नहीं है।</strong> यह केवल एक सामुदायिक डिजिटल पहचान है जिसका कोई कानूनी अधिकार नहीं है।</p>
        <p>This ID card is <strong>not a government document</strong>. It has no legal standing and is purely for community identification.</p>
      </div>

      <div style={S}>
        <h3 style={H}>5. नाबालिगों का डेटा / Minors&apos; Data</h3>
        <p>यह सेवा 18 वर्ष से कम आयु के उपयोगकर्ताओं के लिए माता-पिता या अभिभावक की सहमति के बिना नहीं है।</p>
        <p>This service is not intended for users under 18 years of age without parental or guardian consent.</p>
      </div>

      <div style={S}>
        <h3 style={H}>6. डेटा प्रतिधारण / Data Retention</h3>
        <p>आपका डेटा तब तक संग्रहीत रहेगा जब तक आप इसे हटाने का अनुरोध नहीं करते।</p>
        <p>Your data is retained until you request its deletion.</p>
      </div>

      <div style={S}>
        <h3 style={H}>7. डेटा डिलीट करना / Data Deletion Request</h3>
        <p>अपना डेटा हटाने के लिए ईमेल करें: <a href="mailto:admin@sanatanparivar.in" style={{ color: '#800020' }}>admin@sanatanparivar.in</a></p>
        <p>To request deletion of your data, email: <a href="mailto:admin@sanatanparivar.in" style={{ color: '#800020' }}>admin@sanatanparivar.in</a></p>
      </div>

      <div style={{ ...S, background: '#fff8f0', border: '1px solid rgba(255,107,0,.2)', borderRadius: '1rem', padding: '1.2rem' }}>
        <h3 style={H}>8. संपर्क / Contact</h3>
        <p>प्रश्नों के लिए: <a href="mailto:admin@sanatanparivar.in" style={{ color: '#800020' }}>admin@sanatanparivar.in</a></p>
        <p>SanatanParivar.in</p>
      </div>
    </main>
  );
}
