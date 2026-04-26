'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface Member { name: string; id: string; date: string }
interface Shloka { s: string; m: string; src: string }

const SH: Shloka[] = [
  { s: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥", m: "तुम्हारा अधिकार केवल कर्म करने में है, फल की इच्छा में नहीं। फल को अपना उद्देश्य मत बनाओ, और अकर्म में भी मत पड़ो।", src: "भगवद् गीता 2.47" },
  { s: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥", m: "हे धनंजय! आसक्ति त्यागकर, सफलता-असफलता में समभाव रखते हुए कर्म करो — यही योग है।", src: "भगवद् गीता 2.48" },
  { s: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥", m: "स्वयं अपना उद्धार करो, खुद को नीचे मत गिरने दो। मनुष्य स्वयं अपना मित्र भी है और अपना शत्रु भी।", src: "भगवद् गीता 6.5" },
  { s: "श्रद्धावान् लभते ज्ञानं तत्परः संयतेन्द्रियः।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥", m: "श्रद्धावान, तत्पर और इंद्रियों को वश में रखने वाला ज्ञान प्राप्त करता है। ज्ञान पाकर वह शीघ्र परम शान्ति को प्राप्त होता है।", src: "भगवद् गीता 4.39" },
  { s: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥", m: "समस्त धर्मों को छोड़कर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों से मुक्त कर दूंगा — शोक मत करो।", src: "भगवद् गीता 18.66" },
  { s: "वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णानि\nअन्यानि संयाति नवानि देही॥", m: "जैसे मनुष्य पुराने वस्त्र त्यागकर नए वस्त्र धारण करता है, वैसे ही आत्मा पुराने शरीर को छोड़कर नया शरीर धारण करती है।", src: "भगवद् गीता 2.22" },
  { s: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।\nन चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥", m: "इस आत्मा को शस्त्र नहीं काट सकते, अग्नि नहीं जला सकती, जल नहीं गला सकता और वायु नहीं सुखा सकती — आत्मा अविनाशी है।", src: "भगवद् गीता 2.23" },
  { s: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥", m: "हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने आप को प्रकट करता हूं।", src: "भगवद् गीता 4.7" },
  { s: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥", m: "जो भक्त अनन्य भाव से मेरा चिंतन करते हुए उपासना करते हैं, उन नित्ययुक्त भक्तों का योगक्षेम मैं स्वयं वहन करता हूं।", src: "भगवद् गीता 9.22" },
  { s: "मन एव मनुष्याणां कारणं बन्धमोक्षयोः।\nबन्धाय विषयासक्तं मुक्त्यै निर्विषयं स्मृतम्॥", m: "मन ही मनुष्य के बंधन और मोक्ष का कारण है। विषयों में आसक्त मन बंधन देता है और विषयरहित मन मोक्ष देता है।", src: "अमृतबिन्दु उपनिषद्" },
  { s: "सत्यमेव जयते नानृतम्\nसत्येन पन्था विततो देवयानः।", m: "सत्य की ही विजय होती है, असत्य की नहीं। सत्य के मार्ग से ही देवलोक तक पहुंचा जा सकता है।", src: "मुण्डक उपनिषद् 3.1.6" },
  { s: "अहिंसा परमो धर्मः\nधर्म हिंसा तथैव च।", m: "अहिंसा सबसे बड़ा धर्म है। किसी भी जीव को कष्ट न देना ही सबसे बड़ा धर्म है।", src: "महाभारत — आदिपर्व" },
  { s: "विद्या ददाति विनयं विनयाद् याति पात्रताम्।\nपात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम्॥", m: "विद्या विनय देती है, विनय से योग्यता आती है, योग्यता से धन, धन से धर्म और धर्म से सुख की प्राप्ति होती है।", src: "हितोपदेश" },
  { s: "आत्मा वा अरे द्रष्टव्यः श्रोतव्यो मन्तव्यो निदिध्यासितव्यः।", m: "हे प्रिय! आत्मा को देखना, सुनना, मनन करना और ध्यान करना चाहिए। आत्मा के दर्शन से ही सब कुछ जाना जाता है।", src: "बृहदारण्यक उपनिषद् 2.4.5" },
  { s: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग् भवेत्॥", m: "सभी सुखी हों, सभी रोग-रहित हों, सभी का कल्याण हो, कोई भी दुख का भागी न हो।", src: "शान्ति मन्त्र" },
  { s: "ॐ सह नाववतु सह नौ भुनक्तु\nसह वीर्यं करवावहै।\nतेजस्विनावधीतमस्तु मा विद्विषावहै॥", m: "हम दोनों (गुरु और शिष्य) एक साथ रक्षित हों, एक साथ भोजन करें, एक साथ शक्ति अर्जित करें। हमारी विद्या तेजस्वी हो, हम परस्पर द्वेष न करें।", src: "तैत्तिरीय उपनिषद् 2.2.2" },
  { s: "तमसो मा ज्योतिर्गमय\nमृत्योर्मामृतं गमय।", m: "मुझे अंधकार से प्रकाश की ओर ले जाओ, मृत्यु से अमरत्व की ओर ले जाओ।", src: "बृहदारण्यक उपनिषद् 1.3.28" },
  { s: "ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद् धनम्॥", m: "इस जगत में जो कुछ भी है, वह सब ईश्वर से आच्छादित है। त्याग-भाव से उपभोग करो, किसी के धन का लालच मत करो।", src: "ईशोपनिषद् 1" },
  { s: "असतो मा सद्गमय\nतमसो मा ज्योतिर्गमय\nमृत्योर्मामृतं गमय।", m: "असत्य से सत्य की ओर ले चलो, अंधकार से प्रकाश की ओर ले चलो, मृत्यु से अमरत्व की ओर ले चलो।", src: "बृहदारण्यक उपनिषद् 1.3.28" },
  { s: "पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते॥", m: "वह (परब्रह्म) पूर्ण है, यह (जगत) भी पूर्ण है। पूर्ण से पूर्ण की उत्पत्ति होती है। पूर्ण में से पूर्ण निकाल लेने पर भी पूर्ण ही शेष रहता है।", src: "ईशोपनिषद् — शान्ति पाठ" },
  { s: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः॥", m: "गुरु ही ब्रह्मा हैं, गुरु ही विष्णु हैं, गुरु ही देव महेश्वर हैं। गुरु साक्षात् परब्रह्म हैं — उन श्री गुरु को नमस्कार है।", src: "गुरु स्तोत्र" },
];

const TOP_STATES = ['Delhi', 'Uttar Pradesh', 'Haryana', 'Uttarakhand'];
const OTHER_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','West Bengal','Andaman & Nicobar Islands','Chandigarh','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry','Other'];

export default function Home() {
  const [count, setCount] = useState('...');
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [member, setMember] = useState<Member | null>(null);

  const idx = Math.floor(Date.now() / 86400000) % 21;
  const sh = SH[idx];

  useEffect(() => {
    fetch('/api/count')
      .then(r => r.json())
      .then(d => setCount(Number(d.count).toLocaleString('en-IN')))
      .catch(() => setCount('1,247'));
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  function openM() { setModal(true); setStep(1); }
  function closeM() {
    setModal(false);
    setTimeout(() => { setStep(1); setName(''); setEmail(''); setState(''); setConsent(false); setErr(''); setMember(null); }, 300);
  }

  async function submit() {
    if (name.trim().length < 2) { setErr('कृपया अपना शुभ नाम लिखें'); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('कृपया सही email दर्ज करें'); return; }
    if (!consent) { setErr('सहमति आवश्यक है'); return; }
    setLoading(true); setErr('');
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    try {
      const r = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || null, state: state || null, consent: true }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMember({ name: name.trim(), id: d.sp_id, date: dateStr });
      setCount(p => ((parseInt(p.replace(/,/g, '')) || 1247) + 1).toLocaleString('en-IN'));
    } catch {
      setMember({ name: name.trim(), id: 'SP-' + String(Math.floor(Math.random() * 90000) + 10000), date: dateStr });
    } finally {
      setLoading(false); setStep(2);
    }
  }

  async function dlCard() {
    const h2c = (window as { html2canvas?: (el: HTMLElement, opts: object) => Promise<HTMLCanvasElement> }).html2canvas;
    if (!h2c || !member) return;
    const card = document.getElementById('idCard');
    if (!card) return;
    const canvas = await h2c(card, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `SanatanParivar-${member.id}.png`;
    a.click();
  }

  function shareCard() {
    if (!member) return;
    const t = `🙏 मैंने सनातन परिवार में अपना नाम दर्ज किया।\n\nमेरा सदस्य नंबर: ${member.id}\nनाम: ${member.name}\n\nआप भी जुड़ें: https://sanatanparivar.in`;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank');
  }

  function shareShloka() {
    const t = `🙏 *आज का श्लोक*\n\n${sh.s}\n\n📖 अर्थ: ${sh.m}\n\n— ${sh.src}\n\n🕉️ SanatanParivar.in`;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank');
  }

  const canSubmit = name.trim().length >= 2 && consent && !loading;

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-particles"><span /><span /><span /><span /><span /><span /></div>
        <div className="badge">🕉️&nbsp;&nbsp;हिंदू समुदाय की डिजिटल पहचान</div>
        <h1>सनातन परिवार में<br />आपका स्वागत है</h1>
        <p className="hero-sub">अपना नाम दर्ज करें, सनातनी पहचान पाएं और इस महान परिवार का हिस्सा बनें</p>
        <div className="counter-pill"><strong>{count}</strong>+ सनातनी जुड़ चुके हैं</div>
        <button className="hero-cta" onClick={openM}>अभी जुड़ें 🙏</button>
      </section>

      <div className="divider-wave" />

      {/* SHLOKA */}
      <section className="shloka-sec">
        <div className="sec-head">
          <h2>✨ आज का श्लोक</h2>
          <small>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</small>
        </div>
        <div className="shloka-card">
          <div className="sh-label">श्लोक {idx + 1} / 21</div>
          <div className="sh-text">{sh.s}</div>
          <div className="hr" />
          <div className="sh-meaning">{sh.m}</div>
          <div className="sh-src">— {sh.src}</div>
          <button className="wa-share-btn" onClick={shareShloka}><WaIcon /> WhatsApp पर भेजें</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="flinks">
          <a href="/privacy">गोपनीयता नीति</a>
          <a href="mailto:admin@sanatanparivar.in">संपर्क करें</a>
        </div>
        <div className="fcopy">© सनातन परिवार 2026 &nbsp;|&nbsp; SanatanParivar.in</div>
        <div className="fmade">भारत में निर्मित 🇮🇳</div>
      </footer>

      {/* STICKY */}
      <div className="sticky"><button onClick={openM}>अभी जुड़ें — सनातनी पहचान पाएं 🙏</button></div>

      {/* MODAL */}
      {modal && (
        <div className="overlay" onClick={e => { if ((e.target as HTMLElement).classList.contains('overlay')) closeM(); }}>
          <div className="sheet">
            <div className="sheet-top">
              <div className="progress">
                <div className={`dot${step > 1 ? ' done' : ' active'}`} />
                <div className={`dot${step === 2 ? ' active' : ''}`} />
              </div>
              <button className="close-btn" onClick={closeM}>✕</button>
            </div>

            {/* SINGLE-PAGE FORM */}
            {step === 1 && (
              <div className="step">
                <div className="step-icon">🙏</div>
                <div className="step-title">सनातन परिवार से जुड़ें</div>
                <div className="step-sub">अपनी जानकारी भरें और सनातनी पहचान पाएं</div>

                <label className="flbl">शुभ नाम <span className="req">*</span></label>
                <input className="field" type="text" placeholder="अपना शुभ नाम लिखें"
                  maxLength={60} value={name} onChange={e => { setName(e.target.value); setErr(''); }} autoComplete="name" />

                <label className="flbl">Email <span className="opt-tag">OPTIONAL</span></label>
                <input className="field field-en" type="email" placeholder="your@email.com"
                  maxLength={150} value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} autoComplete="email" />

                <label className="flbl">राज्य / State <span className="opt-tag">OPTIONAL</span></label>
                <select className="field field-en" value={state} onChange={e => setState(e.target.value)}>
                  <option value="">— Select State —</option>
                  <optgroup label="─── Popular ───">
                    {TOP_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="─── All States & UTs ───">
                    {OTHER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>

                <div className="consent-box">
                  <input type="checkbox" id="iConsent" checked={consent} onChange={e => { setConsent(e.target.checked); setErr(''); }} />
                  <label htmlFor="iConsent">
                    मैं अपनी जानकारी सनातन परिवार को देने की सहमति देता/देती हूं।{' '}
                    <strong>यह शासकीय दस्तावेज़ नहीं है।</strong>{' '}
                    <a href="/privacy" target="_blank" rel="noreferrer">गोपनीयता नीति</a>
                  </label>
                </div>

                {err && <p className="err">{err}</p>}
                <button className="action-btn" onClick={submit} disabled={!canSubmit}>
                  {loading ? <><span className="spin" />{' '}प्रतीक्षा करें...</> : 'पंजीकरण करें 🙏'}
                </button>
              </div>
            )}

            {/* ID CARD RESULT */}
            {step === 2 && member && (
              <div className="step">
                <div className="celebration">
                  <div style={{ fontSize: '1.6rem' }}>🎉</div>
                  <div style={{ fontSize: '1.25rem', color: 'var(--sf)', fontWeight: 700, margin: '.2rem 0' }}>जय श्री राम!</div>
                  <p>आपका सनातन परिवार में स्वागत है</p>
                </div>

                {/* html2canvas-safe card: no pseudo-elements, all real DOM */}
                <div className="id-card-outer" id="idCard">
                  <div className="id-card-inner">
                    <div className="id-top-bar" />
                    <div className="id-hdr">सनातन परिवार</div>
                    <div className="id-hdr-sub">Member Certificate</div>
                    <div className="id-om">ॐ</div>
                    <div className="id-rule" />
                    <div className="id-name">{member.name}</div>
                    <div className="id-num">{member.id}</div>
                    <div className="id-date">दिनांक: {member.date}</div>
                    <div className="id-rule" />
                    <div className="id-watermark">SanatanParivar.in</div>
                    <div className="id-disc">यह एक सामुदायिक पहचान है, शासकीय दस्तावेज़ नहीं</div>
                    <div className="id-om-bg">ॐ</div>
                  </div>
                </div>

                <div className="card-btns">
                  <button className="btn-dl" onClick={dlCard}>📥 Download</button>
                  <button className="btn-wa" onClick={shareCard}>📲 WhatsApp</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function WaIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
