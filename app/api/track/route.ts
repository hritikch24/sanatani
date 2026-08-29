import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * First-party page-view tracking.
 *
 * Same privacy stance as /api/upasthiti: we never persist a raw IP, only a
 * salted SHA-256 hash, which is enough to count distinct visitors without
 * holding personal data. No cookies — the session id is generated client-side
 * and lives in sessionStorage, so it dies with the tab.
 */
const SALT = process.env.IP_SALT || 'sanatan-parivar-default-salt-change-me';

const makeSql = () => neon(process.env.DATABASE_URL!);
type SqlClient = ReturnType<typeof makeSql>;

const clip = (v: unknown, max: number) =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

function hashIp(ip: string) {
  return createHash('sha256').update(SALT + '|' + ip).digest('hex');
}

function clientIp(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || '0.0.0.0';
}

/** Coarse UA parsing — enough to answer "phone or desktop", not fingerprinting. */
function parseUa(ua: string) {
  const u = ua.toLowerCase();
  const device = /ipad|tablet/.test(u) ? 'tablet'
    : /mobi|android|iphone/.test(u) ? 'mobile'
    : 'desktop';
  const browser = /edg\//.test(u) ? 'Edge'
    : /opr\/|opera/.test(u) ? 'Opera'
    : /chrome|crios/.test(u) ? 'Chrome'
    : /firefox|fxios/.test(u) ? 'Firefox'
    : /safari/.test(u) ? 'Safari'
    : 'Other';
  return { device, browser };
}

let ready = false;
async function ensureTable(sql: SqlClient) {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id          BIGSERIAL PRIMARY KEY,
      path        TEXT        NOT NULL,
      referrer    TEXT,
      session_id  TEXT        NOT NULL,
      ip_hash     TEXT        NOT NULL,
      country     TEXT        NOT NULL DEFAULT 'XX',
      device      TEXT,
      browser     TEXT,
      utm_source  TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS page_views_created_idx ON page_views (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path)`;
  await sql`CREATE INDEX IF NOT EXISTS page_views_session_idx ON page_views (session_id)`;
  ready = true;
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

    const path = clip(body.path, 300);
    const session = clip(body.session, 60);
    if (!path || !session) return NextResponse.json({ ok: false }, { status: 400 });

    // Never record the dashboard's own traffic.
    if (path.startsWith('/metrics')) return NextResponse.json({ ok: true, skipped: true });

    const sql = makeSql();
    await ensureTable(sql);

    const { device, browser } = parseUa(req.headers.get('user-agent') || '');
    const country = (req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || '').toUpperCase();

    await sql`
      INSERT INTO page_views (path, referrer, session_id, ip_hash, country, device, browser, utm_source)
      VALUES (
        ${path},
        ${clip(body.referrer, 300)},
        ${session},
        ${hashIp(clientIp(req))},
        ${/^[A-Z]{2}$/.test(country) ? country : 'XX'},
        ${device},
        ${browser},
        ${clip(body.utm, 80)}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch {
    // Tracking must never break a page render.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
