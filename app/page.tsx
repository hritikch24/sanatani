'use client';
import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

interface Member { name: string; id: string; date: string }
interface Shloka { s: string; m: string; src: string }

const SH: Shloka[] = [
  {s:"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",m:"तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में नहीं। फल की आसक्ति से रहित होकर कर्म करो।",src:"भगवद् गीता 2.47"},
  {s:"योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",m:"हे धनंजय! आसक्ति त्यागकर, सफलता-असफलता में समभाव रखते हुए कर्म करो — यही योग है।",src:"भगवद् गीता 2.48"},
  {s:"उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",m:"स्वयं अपना उद्धार करो, खुद को नीचे मत गिरने दो। मनुष्य स्वयं अपना मित्र भी है और अपना शत्रु भी।",src:"भगवद् गीता 6.5"},
  {s:"श्रद्धावान् लभते ज्ञानं तत्परः संयतेन्द्रियः।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥",m:"श्रद्धावान, तत्पर और जितेन्द्रिय मनुष्य ज्ञान प्राप्त करता है और शीघ्र ही परम शान्ति को प्राप्त होता है।",src:"भगवद् गीता 4.39"},
  {s:"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",m:"सब धर्मों को छोड़कर केवल मेरी शरण में आओ। मैं तुम्हें सब पापों से मुक्त कर दूँगा।",src:"भगवद् गीता 18.66"},
  {s:"वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णानि\nअन्यानि संयाति नवानि देही॥",m:"जैसे मनुष्य पुराने वस्त्र त्यागकर नए धारण करता है, वैसे ही आत्मा नया शरीर धारण करती है।",src:"भगवद् गीता 2.22"},
  {s:"नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।\nन चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥",m:"आत्मा को शस्त्र नहीं काट सकते, अग्नि नहीं जला सकती, जल नहीं गला सकता, वायु नहीं सुखा सकती।",src:"भगवद् गीता 2.23"},
  {s:"यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",m:"जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अवतार लेता हूं।",src:"भगवद् गीता 4.7"},
  {s:"अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",m:"जो भक्त अनन्य भाव से मेरी उपासना करते हैं, उनका योगक्षेम मैं स्वयं वहन करता हूं।",src:"भगवद् गीता 9.22"},
  {s:"मन एव मनुष्याणां कारणं बन्धमोक्षयोः।\nबन्धाय विषयासक्तं मुक्त्यै निर्विषयं स्मृतम्॥",m:"मन ही बंधन और मोक्ष का कारण है। विषयासक्त मन बांधता है, विषयरहित मन मुक्त करता है।",src:"अमृतबिन्दु उपनिषद्"},
  {s:"सत्यमेव जयते नानृतम्\nसत्येन पन्था विततो देवयानः।",m:"सत्य की ही विजय होती है, असत्य की नहीं। सत्य से ही देवलोक का मार्ग प्रशस्त है।",src:"मुण्डक उपनिषद् 3.1.6"},
  {s:"अहिंसा परमो धर्मः\nधर्म हिंसा तथैव च।",m:"अहिंसा सबसे बड़ा धर्म है। किसी भी जीव को कष्ट न देना ही सबसे बड़ा धर्म है।",src:"महाभारत — आदिपर्व"},
  {s:"विद्या ददाति विनयं विनयाद् याति पात्रताम्।\nपात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम्॥",m:"विद्या विनय देती है, विनय से पात्रता, पात्रता से धन, धन से धर्म और धर्म से सुख मिलता है।",src:"हितोपदेश"},
  {s:"आत्मा वा अरे द्रष्टव्यः श्रोतव्यो मन्तव्यो निदिध्यासितव्यः।",m:"आत्मा को देखना, सुनना, मनन करना और ध्यान करना चाहिए।",src:"बृहदारण्यक उपनिषद् 2.4.5"},
  {s:"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग् भवेत्॥",m:"सभी सुखी हों, सभी रोग-रहित हों, सभी का कल्याण हो, कोई दुःखी न हो।",src:"शान्ति मन्त्र"},
  {s:"ॐ सह नाववतु सह नौ भुनक्तु\nसह वीर्यं करवावहै।\nतेजस्विनावधीतमस्तु मा विद्विषावहै॥",m:"गुरु-शिष्य की एक साथ रक्षा हो, एक साथ शक्ति अर्जित हो। विद्या तेजस्वी हो।",src:"तैत्तिरीय उपनिषद् 2.2.2"},
  {s:"तमसो मा ज्योतिर्गमय\nमृत्योर्मामृतं गमय।",m:"अंधकार से प्रकाश की ओर, मृत्यु से अमरत्व की ओर ले जाओ।",src:"बृहदारण्यक उपनिषद् 1.3.28"},
  {s:"ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद् धनम्॥",m:"जगत में सब कुछ ईश्वर से व्याप्त है। त्याग-भाव से उपभोग करो।",src:"ईशोपनिषद् 1"},
  {s:"असतो मा सद्गमय\nतमसो मा ज्योतिर्गमय\nमृत्योर्मामृतं गमय।",m:"असत्य से सत्य, अंधकार से प्रकाश, मृत्यु से अमरत्व की ओर ले चलो।",src:"बृहदारण्यक उपनिषद् 1.3.28"},
  {s:"पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते॥",m:"वह पूर्ण है, यह पूर्ण है। पूर्ण से पूर्ण निकालने पर भी पूर्ण ही शेष रहता है।",src:"ईशोपनिषद् — शान्ति पाठ"},
  {s:"गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः॥",m:"गुरु ही ब्रह्मा, विष्णु, महेश्वर हैं। गुरु साक्षात् परब्रह्म हैं — नमस्कार है।",src:"गुरु स्तोत्र"},
];

const TOP_STATES = ['Delhi','Uttar Pradesh','Haryana','Uttarakhand'];
const OTHER_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','West Bengal','Andaman & Nicobar Islands','Chandigarh','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry','Other'];

function Ornament() {
  return <div className="ornament"><div className="ln"/><div className="dt"/><div className="dm"/><div className="dt"/><div className="ln"/></div>;
}
function SecOrn({ sym = '✦' }: { sym?: string }) {
  return <div className="sec-orn"><div className="bar"/><div className="sym">{sym}</div><div className="bar r"/></div>;
}


export default function Home() {
  const [count, setCount] = useState('...');
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const cardSecRef = useRef<HTMLElement>(null);

  const idx = Math.floor(Date.now() / 86400000) % 21;
  const sh = SH[idx];

  useEffect(() => {
    fetch('/api/count').then(r => r.json())
      .then(d => setCount(Number(d.count).toLocaleString('en-IN')))
      .catch(() => setCount('1,247'));
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  }

  function openM() { setModal(true); }
  function closeM() {
    setModal(false);
    setTimeout(() => { setName(''); setEmail(''); setState(''); setConsent(false); setErr(''); }, 300);
  }

  async function submit() {
    if (name.trim().length < 2) { setErr('कृपया अपना शुभ नाम लिखें'); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr('कृपया सही email दर्ज करें'); return; }
    if (!consent) { setErr('सहमति आवश्यक है'); return; }
    setLoading(true); setErr('');
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    try {
      const r = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || null, state: state || null, consent: true }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMember({ name: name.trim(), id: d.sp_id, date: dateStr });
      setCount(p => ((parseInt(p.replace(/,/g, '')) || 1247) + 1).toLocaleString('en-IN'));
    } catch {
      setMember({ name: name.trim(), id: 'SP-' + String(Math.floor(Math.random() * 90000) + 10000), date: dateStr });
    } finally {
      setLoading(false); closeM();
      showToast('🙏 जय सनातन! आपका स्वागत है।');
      setTimeout(() => cardSecRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }

  async function dlCard() {
    const h2c = (window as { html2canvas?: (el: HTMLElement, opts: object) => Promise<HTMLCanvasElement> }).html2canvas;
    if (!h2c || !member) return;
    const card = document.getElementById('idCard');
    if (!card) return;
    showToast('📥 डाउनलोड हो रहा है…');
    const canvas = await h2c(card, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `SanatanParivar-${member.id}.png`;
    a.click();
    showToast('✅ सफलतापूर्वक डाउनलोड हुआ!');
  }

  function shareCard() {
    if (!member) return;
    window.open('https://wa.me/?text=' + encodeURIComponent(`🙏 जय सनातन!\n\nमैंने सनातन परिवार में अपना नाम दर्ज किया।\nमेरा सदस्य नंबर: *${member.id}*\n\n🕉️ आप भी जुड़ें: sanatanparivar.in`), '_blank');
  }

  function shareShloka() {
    window.open('https://wa.me/?text=' + encodeURIComponent(`🙏 *आज का दिव्य श्लोक*\n\n${sh.s}\n\n📖 ${sh.m}\n\n— ${sh.src}\n\n🕉️ सनातन परिवार से जुड़ें: sanatanparivar.in`), '_blank');
  }

  const canSubmit = name.trim().length >= 2 && consent && !loading;

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="lazyOnload" />

      {/* SACRED STRIP */}
      <div className="sacred-strip">ॐ नमः शिवाय &nbsp;✦&nbsp; जय श्री राम &nbsp;✦&nbsp; हर हर महादेव</div>

      {/* HERO */}
      <section className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-bg.png" alt="" className="hero-img" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="diya diya-l">🪔</div>
        <div className="diya diya-r">🪔</div>

        <div className="hero-top-label">अखण्ड भारत · सनातन धर्म</div>
        <div className="hero-om">ॐ</div>
        <Ornament />
        <h1>सनातन परिवार में<br />आपका स्वागत है</h1>
        <p className="hero-sub">अपना नाम दर्ज करें, निःशुल्क सनातनी पहचान पाएं और इस दिव्य परिवार का हिस्सा बनें।</p>
        <Ornament />
        <div className="counter-pill" style={{ marginTop: '1.5rem' }}>
          <div className="live-dot" />
          <span><strong>{count}</strong>+ सनातनी जुड़ चुके हैं</span>
        </div>
        <button className="hero-cta" onClick={openM}>🙏 अभी जुड़ें — निःशुल्क</button>
        <div className="social-proof">
          <div className="avatars"><span>र</span><span>स</span><span>प</span><span>अ</span></div>
          अभी {count}+ सनातनी इस परिवार में हैं
        </div>
        <div className="scroll-hint">
          <span>और देखें</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-item"><div className="stat-num">{count}+</div><div className="stat-label">सनातनी सदस्य</div></div>
        <div className="stat-item"><div className="stat-num">21</div><div className="stat-label">दैनिक श्लोक</div></div>
        <div className="stat-item"><div className="stat-num">36</div><div className="stat-label">राज्य एवं केंद्र</div></div>
      </div>

      {/* SHLOKA */}
      <section className="shloka-sec">
        <div className="shloka-bg-om">ॐ</div>
        <div className="shloka-label">आज का दिव्य श्लोक</div>
        <div className="shloka-day">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <SecOrn sym="✦" />
        <div className="sh-text">{sh.s}</div>
        <div className="sh-meaning">{sh.m}</div>
        <div className="sh-src">— {sh.src}</div>
        <SecOrn sym="✦" />
        <button className="btn-wa-shloka" onClick={shareShloka}><WaIcon size={16} /> WhatsApp पर भेजें</button>
        <br />
        <button className="shloka-cta" onClick={openM}>🙏 सनातन परिवार से जुड़ें</button>
      </section>

      {/* VISION & MISSION */}
      <section className="vision-sec" id="vision">
        <SecOrn sym="ॐ" />
        <h2 className="vision-title">हमारी दृष्टि एवं लक्ष्य</h2>
        <SecOrn sym="✦" />
        <div className="vision-grid">
          <article className="vision-card">
            <h3>🔱 दृष्टि (Vision)</h3>
            <p>प्रत्येक सनातनी को एक डिजिटल पहचान प्रदान करना — जो जाति, भाषा और क्षेत्र से परे हो। एक ऐसा मंच जहां हर हिंदू गर्व से कहे — &ldquo;मैं सनातनी हूं।&rdquo;</p>
          </article>
          <article className="vision-card">
            <h3>🎯 लक्ष्य (Mission)</h3>
            <p>सनातन धर्म के ज्ञान, श्लोकों और संस्कृति को डिजिटल माध्यम से हर घर तक पहुंचाना। एक करोड़ सनातनियों को एक परिवार में जोड़ना — &ldquo;वसुधैव कुटुम्बकम्।&rdquo;</p>
          </article>
          <article className="vision-card">
            <h3>🙏 उद्देश्य (Purpose)</h3>
            <p>धर्म की रक्षा, संस्कृति का संरक्षण, और आने वाली पीढ़ी को सनातन मूल्यों से जोड़ना। यह कोई संगठन नहीं, यह एक परिवार है — सनातन परिवार।</p>
          </article>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-sec">
        <SecOrn sym="ॐ" />
        <h2 className="values-title">सनातन के स्तम्भ</h2>
        <SecOrn sym="✦" />
        <div className="values-grid">
          <div className="value-item"><span className="value-icon">🕉️</span><div className="value-name">धर्म</div><div className="value-desc">सत्य और न्याय का मार्ग</div></div>
          <div className="value-item"><span className="value-icon">🙏</span><div className="value-name">सेवा</div><div className="value-desc">निःस्वार्थ सेवा ही पूजा</div></div>
          <div className="value-item"><span className="value-icon">📖</span><div className="value-name">ज्ञान</div><div className="value-desc">वेद, उपनिषद् और गीता</div></div>
          <div className="value-item"><span className="value-icon">🙌</span><div className="value-name">एकता</div><div className="value-desc">वसुधैव कुटुम्बकम्</div></div>
          <div className="value-item"><span className="value-icon">🕊️</span><div className="value-name">अहिंसा</div><div className="value-desc">सभी प्राणियों में दया</div></div>
          <div className="value-item"><span className="value-icon">🇮🇳</span><div className="value-name">राष्ट्र</div><div className="value-desc">भारत माता की सेवा</div></div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testi-strip">
        <div className="testi-quote">&ldquo;सनातन परिवार से जुड़कर मुझे गर्व हुआ कि मैं सनातनी हूं। हर दिन एक नया श्लोक पढ़ता हूं। यह पहचान मेरे लिए अनमोल है।&rdquo;</div>
        <div className="testi-name">— राहुल शर्मा, दिल्ली</div>
      </section>

      {/* WHY JOIN */}
      <section className="why-sec">
        <SecOrn sym="ॐ" />
        <h2 className="why-title">सनातन परिवार क्यों?</h2>
        <SecOrn sym="✦" />
        <div className="pillars">
          <div className="pillar"><span className="pillar-icon">🪪</span><div className="pillar-name">निःशुल्क डिजिटल सनातनी पहचान पत्र</div></div>
          <div className="pillar"><span className="pillar-icon">📿</span><div className="pillar-name">प्रतिदिन नया श्लोक और अर्थ</div></div>
          <div className="pillar"><span className="pillar-icon">🤝</span><div className="pillar-name">लाखों सनातनियों का एक परिवार</div></div>
          <div className="pillar"><span className="pillar-icon">📲</span><div className="pillar-name">WhatsApp से शेयर करें, परिवार बढ़ाएं</div></div>
        </div>
      </section>

      {/* ID CARD SECTION */}
      {member && (
        <section ref={cardSecRef} style={{ padding: '2.5rem 1.25rem 2rem', background: 'linear-gradient(175deg,#fff8e8,#ffe8a0)', textAlign: 'center', borderTop: '3px solid var(--gd)' }}>
          <SecOrn sym="ॐ" />
          <div className="celebration">
            <div style={{ fontSize: '1.6rem' }}>🎉</div>
            <div style={{ fontSize: '1.25rem', color: 'var(--mr)', fontWeight: 700, margin: '.2rem 0' }}>जय श्री राम!</div>
            <p>आपका सनातन परिवार में स्वागत है</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div className="card-border-wrap">
              <div className="id-card" id="idCard">
                <div className="card-header">
                  <div className="card-header-om">ॐ</div>
                  <div className="card-header-title">सनातन परिवार सदस्य प्रमाण पत्र</div>
                  <div className="card-header-sub">SANATAN PARIVAR MEMBER CERTIFICATE</div>
                </div>
                <div className="card-body">
                  <div className="card-watermark">ॐ</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginBottom: '.25rem', fontFamily: 'var(--deva)' }}>सम्मानित सदस्य</div>
                  <div className="card-name">{member.name}</div>
                  <div className="card-sep"><div className="l"/><div className="d"/><div className="r"/></div>
                  <div className="card-id-num">{member.id}</div>
                  <div className="card-detail">दिनांक: {member.date}</div>
                  <div className="card-sep" style={{ marginTop: '.5rem' }}><div className="l"/><div className="d"/><div className="r"/></div>
                </div>
                <div className="card-footer-band">
                  <div className="card-footer-site">SanatanParivar.in</div>
                  <div className="card-footer-disc">यह एक सामुदायिक पहचान है,<br/>शासकीय दस्तावेज़ नहीं</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-btns">
            <button className="card-btn dl" onClick={dlCard}>📥 &nbsp;Download</button>
            <button className="card-btn wa" onClick={shareCard}>📲 &nbsp;WhatsApp</button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-om">ॐ</div>
        <Ornament />
        <div className="footer-links">
          <a href="/privacy">गोपनीयता नीति</a>
          <a href="mailto:contact@sanatanparivar.in">संपर्क</a>
        </div>
        <div className="footer-copy">
          © सनातन परिवार 2026<br />भारत में निर्मित 🇮🇳<br />
          <span style={{ fontSize: '.7rem', opacity: .5 }}>जय हिन्द · वन्दे मातरम्</span>
        </div>
      </footer>

      {/* STICKY */}
      <div className="sticky-cta">
        <button className="btn-main" onClick={openM}>🙏 &nbsp;अभी जुड़ें — सदा के लिए निःशुल्क</button>
        <div className="sticky-sub">30 सेकंड में पंजीकरण · कोई शुल्क नहीं · तुरंत पहचान पत्र</div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="overlay" onClick={e => { if ((e.target as HTMLElement).classList.contains('overlay')) closeM(); }}>
          <div className="modal-sheet">
            <div className="modal-handle" />
            <button className="modal-close" onClick={closeM}>✕</button>
            <div className="modal-inner">
              <div className="step-progress"><div className="step-dot active" /><div className="step-dot" /></div>
              <div className="step">
                <div className="step-icon">🪔</div>
                <div className="step-title">सनातन परिवार से जुड़ें</div>
                <div className="step-sub">अपनी जानकारी भरें और सनातनी पहचान पाएं</div>
                <Ornament />
                <div className="name-wrap" style={{ marginTop: '1.5rem' }}>
                  <span className="name-prefix">🙏</span>
                  <input className="spiritual-input" type="text" placeholder="अपना शुभ नाम लिखें…"
                    maxLength={60} value={name} onChange={e => { setName(e.target.value); setErr(''); }} autoComplete="name" />
                </div>
                <div className="field-row">
                  <div className="field-label">📧 Email (वैकल्पिक)</div>
                  <input className="email-input" type="email" placeholder="your@email.com"
                    maxLength={150} value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} autoComplete="email" />
                </div>
                <div className="field-row">
                  <div className="field-label">📍 राज्य / State (वैकल्पिक)</div>
                  <select className="spiritual-select" value={state} onChange={e => setState(e.target.value)}>
                    <option value="">— Select State —</option>
                    <optgroup label="─── Popular ───">{TOP_STATES.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                    <optgroup label="─── All States & UTs ───">{OTHER_STATES.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>
                  </select>
                </div>
                <div className="consent-box">
                  <label className="consent-row">
                    <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setErr(''); }} />
                    <span>मैं अपनी जानकारी सनातन परिवार को देने की सहमति देता/देती हूं। <strong>यह शासकीय दस्तावेज़ नहीं है।</strong>{' '}<a href="/privacy" target="_blank" rel="noreferrer">गोपनीयता नीति</a></span>
                  </label>
                </div>
                {err && <p className="err">{err}</p>}
                <button className="btn-next" onClick={submit} disabled={!canSubmit}>
                  {loading ? <><span className="spin" /> प्रतीक्षा करें...</> : '🙏  पंजीकरण करें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
}

function WaIcon({ size = 19 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
