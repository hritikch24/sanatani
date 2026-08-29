'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/* ── Types ──────────────────────────────────────────────────────────── */
interface Named { [k: string]: string | number }

interface Metrics {
  period: { hours: number; since: string; bucket: string };
  traffic: {
    views: number; sessions: number; visitors: number;
    topPages: { path: string; views: number }[];
    referrers: { referrer: string; views: number }[];
    devices: { device: string; count: number }[];
    browsers: { browser: string; count: number }[];
    countries: { country: string; count: number }[];
    utmSources: { utm_source: string; count: number }[];
    visitorsTop: { visitor: string; count: number }[];
    daily: { date: string; views: number }[];
  };
  members: {
    total: number; inPeriod: number;
    byState: { state: string; count: number }[];
    daily: { date: string; count: number }[];
    recent: { sp_id: string; name: string; state: string; registered_at: string | null }[];
  };
  upasthiti: {
    people: number; hits: number; countries: number;
    byCountry: { country: string; people: number; hits: number }[];
    daily: { date: string; count: number }[];
  };
}

const PERIODS: Record<string, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
};

type Tab = 'overview' | 'traffic' | 'members' | 'presence';
const TABS: [Tab, string][] = [
  ['overview', 'Overview'],
  ['traffic', 'Traffic'],
  ['members', 'Members'],
  ['presence', 'उपस्थिति'],
];

const fmt = (n: number) => n.toLocaleString('en-IN');

function flag(cc: string) {
  if (!/^[A-Z]{2}$/.test(cc)) return '🌍';
  return String.fromCodePoint(...[...cc].map(c => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/* ── Pieces ─────────────────────────────────────────────────────────── */
function Stat({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`mx-stat${accent ? ' accent' : ''}`}>
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-card">
      <h2>{title}</h2>
      <div className="mx-card-body">{children}</div>
    </section>
  );
}

function Bars({ data, labelKey, valueKey, tone = '', max = 10, prefix }: {
  data: Named[]; labelKey: string; valueKey: string;
  tone?: '' | 'b' | 'g' | 'v'; max?: number; prefix?: (row: Named) => string;
}) {
  if (!data?.length) return <div className="mx-empty">No data yet</div>;
  const rows = data.slice(0, max);
  const peak = Math.max(...rows.map(r => Number(r[valueKey]) || 0), 1);
  return (
    <div className="mx-bars">
      {rows.map((r, i) => {
        const v = Number(r[valueKey]) || 0;
        const label = String(r[labelKey] ?? '—');
        return (
          <div key={`${label}-${i}`}>
            <div className="mx-bar-top">
              <span className="mx-bar-label" title={label}>
                {prefix ? prefix(r) + ' ' : ''}{label}
              </span>
              <span className="mx-bar-val">{fmt(v)}</span>
            </div>
            <div className="mx-bar-track">
              <div className={`mx-bar-fill ${tone}`} style={{ width: `${Math.max(2, (v / peak) * 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Area({ data, valueKey }: { data: Named[]; valueKey: string }) {
  if (!data?.length) return <div className="mx-chart-empty">No data yet</div>;
  const pts = data.map(d => Number(d[valueKey]) || 0);
  const peak = Math.max(...pts, 1);
  const W = 600, H = 150, P = 8;
  const step = pts.length > 1 ? (W - P * 2) / (pts.length - 1) : 0;
  const xy = pts.map((v, i) => [P + i * step, H - P - (v / peak) * (H - P * 2)] as const);
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const fill = `${line} L${xy[xy.length - 1][0].toFixed(1)},${H - P} L${xy[0][0].toFixed(1)},${H - P} Z`;
  return (
    <svg className="mx-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
      aria-label={`Trend, peak ${peak}`}>
      <defs>
        <linearGradient id="mxg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9a441" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#d9a441" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#mxg)" />
      <path d={line} fill="none" stroke="#f0c66b" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ago(iso: string | null) {
  if (!iso) return '—';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function MetricsPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [data, setData] = useState<Metrics | null>(null);
  const [period, setPeriod] = useState('24h');
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('_sp_metrics_key');
      if (saved) { setKey(saved); setAuthed(true); }
    } catch { /* storage blocked */ }
  }, []);

  const load = useCallback(async (k: string, p: string) => {
    setLoading(true); setErr('');
    try {
      const q = p.endsWith('h') ? `hours=${p.slice(0, -1)}` : `days=${p.slice(0, -1)}`;
      const res = await fetch(`/api/metrics?${q}&key=${encodeURIComponent(k)}`, { cache: 'no-store' });
      if (res.status === 401) {
        setErr('Invalid admin key'); setAuthed(false);
        try { sessionStorage.removeItem('_sp_metrics_key'); } catch {}
        return;
      }
      if (!res.ok) throw new Error('failed');
      setData(await res.json());
      setAuthed(true);
      try { sessionStorage.setItem('_sp_metrics_key', k); } catch {}
    } catch {
      setErr('Could not load metrics.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed && key) load(key, period); }, [authed, key, period, load]);

  const derived = useMemo(() => {
    if (!data) return null;
    const s = data.traffic.sessions;
    return {
      pps: s > 0 ? (data.traffic.views / s).toFixed(1) : '0',
      conv: s > 0 ? ((data.members.inPeriod / s) * 100).toFixed(1) : '0',
    };
  }, [data]);

  if (!authed) {
    return (
      <div className="mx">
        <div className="mx-login">
          <form onSubmit={e => { e.preventDefault(); if (key.trim()) load(key.trim(), period); }}>
            <div className="mx-badge">ॐ</div>
            <h1>सनातन परिवार Metrics</h1>
            <p>Enter your admin API key</p>
            <input className="mx-input" type="password" value={key} autoFocus
              onChange={e => setKey(e.target.value)} placeholder="Admin key" />
            {err && <div className="mx-err">{err}</div>}
            <button className="mx-btn" type="submit" disabled={!key.trim() || loading}>
              {loading ? <><span className="mx-spin" /> Checking…</> : 'Open dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const t = data?.traffic;
  const m = data?.members;
  const u = data?.upasthiti;

  return (
    <div className="mx">
      <div className="mx-shell">
        <header className="mx-head">
          <div className="mx-title">
            <span className="om">ॐ</span>
            <div>
              <h1>सनातन परिवार Metrics</h1>
              <span>{PERIODS[period]}{loading ? ' · refreshing…' : ''}</span>
            </div>
          </div>
          <div className="mx-actions">
            <div className="mx-period">
              {Object.keys(PERIODS).map(p => (
                <button key={p} className={p === period ? 'on' : ''} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
            <button className="mx-icon-btn" onClick={() => load(key, period)} title="Refresh">↻</button>
            <button className="mx-icon-btn" title="Sign out" onClick={() => {
              try { sessionStorage.removeItem('_sp_metrics_key'); } catch {}
              setAuthed(false); setKey(''); setData(null);
            }}>Sign out</button>
          </div>
        </header>

        <nav className="mx-tabs">
          {TABS.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>

        {!data ? (
          <div className="mx-empty">{loading ? <><span className="mx-spin" /> Loading…</> : (err || 'No data')}</div>
        ) : (
          <>
            {tab === 'overview' && t && m && u && (
              <>
                <div className="mx-stats">
                  <Stat label="Page views" value={fmt(t.views)} sub={PERIODS[period]} accent />
                  <Stat label="Sessions" value={fmt(t.sessions)} />
                  <Stat label="Visitors" value={fmt(t.visitors)} sub="distinct devices" />
                  <Stat label="Pages / session" value={derived?.pps ?? '0'} />
                  <Stat label="New members" value={fmt(m.inPeriod)} sub={PERIODS[period]} accent />
                  <Stat label="Signup rate" value={`${derived?.conv ?? 0}%`} sub="members / sessions" />
                </div>
                <div className="mx-grid two">
                  <Card title="Page views over time"><Area data={t.daily as unknown as Named[]} valueKey="views" /></Card>
                  <Card title="New members over time"><Area data={m.daily as unknown as Named[]} valueKey="count" /></Card>
                </div>
                <div className="mx-grid two">
                  <Card title="Top pages"><Bars data={t.topPages as unknown as Named[]} labelKey="path" valueKey="views" /></Card>
                  <Card title="Referrers"><Bars data={t.referrers as unknown as Named[]} labelKey="referrer" valueKey="views" tone="b" /></Card>
                </div>
              </>
            )}

            {tab === 'traffic' && t && (
              <>
                <div className="mx-stats">
                  <Stat label="Page views" value={fmt(t.views)} accent />
                  <Stat label="Sessions" value={fmt(t.sessions)} />
                  <Stat label="Visitors" value={fmt(t.visitors)} />
                  <Stat label="Pages / session" value={derived?.pps ?? '0'} />
                </div>
                <div className="mx-grid two">
                  <Card title="Top pages"><Bars data={t.topPages as unknown as Named[]} labelKey="path" valueKey="views" max={15} /></Card>
                  <Card title="Referrers"><Bars data={t.referrers as unknown as Named[]} labelKey="referrer" valueKey="views" tone="b" max={12} /></Card>
                </div>
                <div className="mx-grid three">
                  <Card title="Devices"><Bars data={t.devices as unknown as Named[]} labelKey="device" valueKey="count" tone="g" /></Card>
                  <Card title="Browsers"><Bars data={t.browsers as unknown as Named[]} labelKey="browser" valueKey="count" tone="v" /></Card>
                  <Card title="Countries">
                    <Bars data={t.countries as unknown as Named[]} labelKey="country" valueKey="count" tone="b"
                      prefix={r => flag(String(r.country))} />
                  </Card>
                </div>
                <div className="mx-grid two">
                  <Card title="UTM sources"><Bars data={t.utmSources as unknown as Named[]} labelKey="utm_source" valueKey="count" /></Card>
                  <Card title="Most active visitors">
                    <Bars data={t.visitorsTop as unknown as Named[]} labelKey="visitor" valueKey="count" tone="v" />
                    <p className="mx-note">
                      Identified by a salted hash prefix — raw IP addresses are never stored.
                    </p>
                  </Card>
                </div>
              </>
            )}

            {tab === 'members' && m && (
              <>
                <div className="mx-stats">
                  <Stat label="Total members" value={fmt(m.total)} accent />
                  <Stat label="New this period" value={fmt(m.inPeriod)} sub={PERIODS[period]} />
                  <Stat label="Signup rate" value={`${derived?.conv ?? 0}%`} sub="of sessions" />
                </div>
                <div className="mx-grid two">
                  <Card title="New members over time"><Area data={m.daily as unknown as Named[]} valueKey="count" /></Card>
                  <Card title="By state"><Bars data={m.byState as unknown as Named[]} labelKey="state" valueKey="count" tone="g" max={12} /></Card>
                </div>
                <section className="mx-card">
                  <h2>Recent registrations</h2>
                  <div className="mx-tbl-wrap">
                    <table className="mx-tbl">
                      <thead><tr><th>ID</th><th>Name</th><th>State</th><th>When</th></tr></thead>
                      <tbody>
                        {m.recent.length === 0 && (
                          <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1.4rem' }}>No members yet</td></tr>
                        )}
                        {m.recent.map(r => (
                          <tr key={r.sp_id}>
                            <td><span className="mx-pill">{r.sp_id}</span></td>
                            <td className="k">{r.name}</td>
                            <td>{r.state || '—'}</td>
                            <td>{ago(r.registered_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {tab === 'presence' && u && (
              <>
                <div className="mx-stats">
                  <Stat label="Sanatanis present" value={fmt(u.people)} accent />
                  <Stat label="Total darshan" value={fmt(u.hits)} sub="incl. repeat visits" />
                  <Stat label="Countries" value={fmt(u.countries)} />
                  <Stat label="Avg per person" value={u.people ? (u.hits / u.people).toFixed(1) : '0'} />
                </div>
                <div className="mx-grid two">
                  <Card title="New presence over time"><Area data={u.daily as unknown as Named[]} valueKey="count" /></Card>
                  <Card title="By country">
                    <Bars data={u.byCountry as unknown as Named[]} labelKey="country" valueKey="people" max={15}
                      prefix={r => flag(String(r.country))} />
                  </Card>
                </div>
                <p className="mx-note">
                  These counts come from the public <code>/upasthiti</code> page and are all-time,
                  not limited to the selected period.
                </p>
              </>
            )}
          </>
        )}

        <p className="mx-note">
          This dashboard is noindex and key-gated. Its own traffic is excluded from tracking.
        </p>
      </div>
    </div>
  );
}
