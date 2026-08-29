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
      <p style={{ ...S, fontSize: '.82rem', color: '#aaa' }}>अंतिम अपडेट: अगस्त 2026 | Last updated: August 2026</p>

      <div style={S}>
        <h3 style={H}>1. हम क्या डेटा एकत्र करते हैं / Data We Collect</h3>
        <p><strong>पहचान पत्र पंजीकरण करने पर / When you register for an ID card:</strong></p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>नाम (अनिवार्य) / Name (required)</li>
          <li>ईमेल (वैकल्पिक) / Email (optional)</li>
          <li>राज्य (वैकल्पिक) / State (optional)</li>
          <li>पंजीकरण तिथि / Registration timestamp</li>
        </ul>
        <p style={{ marginTop: '.75rem' }}><strong>सनातन उपस्थिति पृष्ठ पर / On the presence page (/upasthiti):</strong></p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>कोई नाम या ईमेल नहीं / No name or email is collected</li>
          <li>आपके IP का साल्टेड हैश — मूल IP संग्रहित नहीं होता / A salted hash of your IP; the raw IP is never stored</li>
          <li>केवल देश-स्तर की जानकारी / Country-level location only</li>
          <li>दर्शन की संख्या एवं समय / Visit count and timestamp</li>
        </ul>
        <p style={{ marginTop: '.75rem' }}><strong>प्रत्येक पृष्ठ पर / On every page:</strong></p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>देखा गया पृष्ठ एवं समय / Page visited and timestamp</li>
          <li>आप किस लिंक से आए (referrer) / Referring link</li>
          <li>उपकरण एवं ब्राउज़र का प्रकार / Device and browser type</li>
          <li>देश (केवल देश-स्तर) / Country only</li>
          <li>आपके IP का साल्टेड हैश — मूल IP नहीं / A salted hash of your IP, never the raw IP</li>
          <li>एक अस्थायी सत्र पहचान, जो टैब बंद होते ही समाप्त हो जाती है / A temporary session id that is discarded when the tab closes</li>
        </ul>
        <p style={{ marginTop: '.5rem', fontSize: '.85rem', opacity: .85 }}>
          यह हमारा अपना आँकड़ा-संग्रह है — कोई तीसरे पक्ष का विश्लेषण उपकरण, विज्ञापन नेटवर्क या
          ट्रैकिंग कुकी उपयोग नहीं की जाती। इसका उद्देश्य केवल यह समझना है कि कौन सी सामग्री उपयोगी है।<br />
          This is first-party only — no third-party analytics, ad networks or tracking cookies. It exists
          solely to understand which content is useful.
        </p>
        <p style={{ marginTop: '.5rem', fontSize: '.85rem', opacity: .85 }}>
          हैश एकतरफ़ा है — उससे आपका वास्तविक IP पुनः प्राप्त नहीं किया जा सकता। इसका उद्देश्य केवल यह है
          कि एक ही व्यक्ति दोबारा गिना न जाए।<br />
          The hash is one-way and cannot be reversed to your IP. It exists only to avoid double-counting the same visitor.
        </p>
      </div>

      <div style={S}>
        <h3 style={H}>2. उपयोग का उद्देश्य / Purpose of Use</h3>
        <p>सामुदायिक सदस्यता निर्देशिका, डिजिटल पहचान पत्र, तथा देश अनुसार सामुदायिक उपस्थिति के आँकड़े दिखाना।</p>
        <p>Community membership directory, digital ID cards, and aggregate country-wise presence statistics.</p>
        <p style={{ marginTop: '.5rem' }}>हम विज्ञापन या ट्रैकिंग कुकी का उपयोग नहीं करते। / We use no advertising or tracking cookies.</p>
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
