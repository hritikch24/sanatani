'use client';
import { useState, useEffect, useCallback } from 'react';

interface Row { country: string; people: number; hits: number }
interface Snap { people: number; hits: number; countries: number; today: number; byCountry: Row[] }
interface You { hits: number; country: string; isNew: boolean }

/** ISO-3166 alpha-2 → flag emoji via regional indicator symbols. */
function flag(cc: string) {
  if (!/^[A-Z]{2}$/.test(cc)) return '🌍';
  return String.fromCodePoint(...[...cc].map(c => 0x1f1e6 + c.charCodeAt(0) - 65));
}

const NAMES: Record<string, string> = {
  IN: 'भारत', NP: 'नेपाल', US: 'संयुक्त राज्य अमेरिका', GB: 'ब्रिटेन', CA: 'कनाडा',
  AU: 'ऑस्ट्रेलिया', NZ: 'न्यूज़ीलैंड', AE: 'संयुक्त अरब अमीरात', SA: 'सऊदी अरब',
  QA: 'क़तर', KW: 'कुवैत', OM: 'ओमान', BH: 'बहरीन', SG: 'सिंगापुर', MY: 'मलेशिया',
  MU: 'मॉरीशस', FJ: 'फिजी', TT: 'त्रिनिदाद एवं टोबैगो', GY: 'गयाना', SR: 'सूरीनाम',
  ZA: 'दक्षिण अफ्रीका', KE: 'केन्या', TZ: 'तंज़ानिया', UG: 'युगांडा', NG: 'नाइजीरिया',
  LK: 'श्रीलंका', BD: 'बांग्लादेश', PK: 'पाकिस्तान', BT: 'भूटान', MV: 'मालदीव',
  MM: 'म्यांमार', TH: 'थाईलैंड', ID: 'इंडोनेशिया', PH: 'फिलीपींस', VN: 'वियतनाम',
  JP: 'जापान', KR: 'दक्षिण कोरिया', CN: 'चीन', HK: 'हांगकांग', TW: 'ताइवान',
  DE: 'जर्मनी', FR: 'फ़्रांस', IT: 'इटली', ES: 'स्पेन', PT: 'पुर्तगाल', NL: 'नीदरलैंड',
  BE: 'बेल्जियम', CH: 'स्विट्ज़रलैंड', AT: 'ऑस्ट्रिया', SE: 'स्वीडन', NO: 'नॉर्वे',
  DK: 'डेनमार्क', FI: 'फ़िनलैंड', IE: 'आयरलैंड', PL: 'पोलैंड', RU: 'रूस', UA: 'यूक्रेन',
  TR: 'तुर्की', IL: 'इज़राइल', EG: 'मिस्र', MA: 'मोरक्को', BR: 'ब्राज़ील',
  AR: 'अर्जेंटीना', MX: 'मेक्सिको', CL: 'चिली', CO: 'कोलंबिया', PE: 'पेरू',
  JM: 'जमैका', PA: 'पनामा', XX: 'अन्य / अज्ञात',
};

const nameOf = (cc: string) => NAMES[cc] || cc;
const fmt = (n: number) => n.toLocaleString('en-IN');

export default function Upasthiti() {
  const [snap, setSnap] = useState<Snap | null>(null);
  const [you, setYou] = useState<You | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [pulse, setPulse] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/upasthiti', { cache: 'no-store' });
      if (r.ok) setSnap(await r.json());
    } catch { /* offline — keep last known */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function mark() {
    if (busy) return;
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/upasthiti', { method: 'POST' });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || 'कुछ त्रुटि हुई। पुनः प्रयास करें।'); return; }
      setYou(d.you);
      setSnap({ people: d.people, hits: d.hits, countries: d.countries, today: d.today, byCountry: d.byCountry });
      setPulse(true); setTimeout(() => setPulse(false), 1200);
    } catch {
      setErr('नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally { setBusy(false); }
  }

  function share() {
    const total = snap ? fmt(snap.people) : '';
    const text = `🕉️ मैंने सनातन परिवार में अपनी उपस्थिति दर्ज की है।\n\nअब तक ${total} सनातनी ${snap?.countries ?? 0} देशों से जुड़ चुके हैं।\n\nआप भी एक क्लिक में जुड़ें 👇\nhttps://sanatanparivar.in/upasthiti`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  }

  const rows = snap?.byCountry ?? [];
  const visible = showAll ? rows : rows.slice(0, 12);
  const max = rows.length ? Math.max(...rows.map(r => r.people)) : 1;

  return (
    <section className="up-wrap">
      <div className={`up-counter${pulse ? ' pulse' : ''}`}>
        <div className="up-om">ॐ</div>
        <div className="up-big">{snap ? fmt(snap.people) : '…'}</div>
        <div className="up-big-label">सनातनी उपस्थित</div>
        <div className="up-meta">
          <span><strong>{snap ? fmt(snap.countries) : '…'}</strong> देश</span>
          <span className="up-dot" />
          <span><strong>{snap ? fmt(snap.hits) : '…'}</strong> कुल दर्शन</span>
          <span className="up-dot" />
          <span><strong>{snap ? fmt(snap.today) : '…'}</strong> आज सक्रिय</span>
        </div>
      </div>

      {!you ? (
        <button className="up-btn" onClick={mark} disabled={busy}>
          {busy ? <><span className="spin" /> दर्ज हो रही है…</> : '🪔 मैं सनातनी हूँ — उपस्थिति दर्ज करें'}
        </button>
      ) : (
        <div className="up-done">
          <div className="up-done-icon">🙏</div>
          <div className="up-done-title">
            {you.isNew ? 'आपकी उपस्थिति दर्ज हो गई' : 'आपका पुनः स्वागत है'}
          </div>
          <div className="up-done-sub">
            {flag(you.country)} {nameOf(you.country)} से — आपने {you.hits} बार दर्शन किए
          </div>
          <div className="up-done-actions">
            <button className="up-share" onClick={share}>WhatsApp पर साझा करें</button>
            <button className="up-again" onClick={mark} disabled={busy}>पुनः दर्शन</button>
          </div>
        </div>
      )}

      {err && <p className="err" style={{ textAlign: 'center' }}>{err}</p>}

      <div className="up-note">कोई फॉर्म नहीं · कोई लॉगिन नहीं · कोई नाम नहीं</div>

      {rows.length > 0 && (
        <div className="up-board">
          <h2 className="up-board-title">देश अनुसार सनातन उपस्थिति</h2>
          <ol className="up-list">
            {visible.map((r, i) => (
              <li key={r.country} className={`up-row${you?.country === r.country ? ' mine' : ''}`}>
                <span className="up-rank">{i + 1}</span>
                <span className="up-flag">{flag(r.country)}</span>
                <span className="up-name">{nameOf(r.country)}</span>
                <span className="up-bar-wrap">
                  <span className="up-bar" style={{ width: `${Math.max(4, (r.people / max) * 100)}%` }} />
                </span>
                <span className="up-num">{fmt(r.people)}</span>
              </li>
            ))}
          </ol>
          {rows.length > 12 && (
            <button className="up-more" onClick={() => setShowAll(v => !v)}>
              {showAll ? 'कम दिखाएँ' : `सभी ${rows.length} देश देखें`}
            </button>
          )}
        </div>
      )}

      {rows.length === 0 && snap && (
        <div className="up-empty">
          <div className="up-empty-om">🪔</div>
          <p>अभी तक कोई उपस्थिति दर्ज नहीं हुई। पहले सनातनी बनिए — ऊपर बटन दबाइए।</p>
        </div>
      )}

      <div className="up-card-cta">
        <p>अपना निःशुल्क सनातनी डिजिटल पहचान पत्र भी चाहिए?</p>
        <a href="/" className="up-card-link">🪪 पहचान पत्र के लिए पंजीकरण करें</a>
      </div>
    </section>
  );
}
