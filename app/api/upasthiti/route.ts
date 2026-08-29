import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * उपस्थिति (presence) tracking.
 *
 * Privacy note: we deliberately do NOT persist raw IP addresses. Each visitor is
 * identified by a salted SHA-256 hash of their IP, which still gives us a stable
 * per-visitor key (so `hits` counts how many times the same visitor returned)
 * without storing personal data. Set IP_SALT in the environment; rotating it
 * resets all visitor identities.
 */
const SALT = process.env.IP_SALT || 'sanatan-parivar-default-salt-change-me';

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || '0.0.0.0';
}

function hashIp(ip: string): string {
  return createHash('sha256').update(SALT + '|' + ip).digest('hex');
}

/** Vercel and Cloudflare both expose geo via headers — no external lookup needed. */
function geo(req: NextRequest) {
  const h = req.headers;
  const country = (h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || '').toUpperCase();
  const region = h.get('x-vercel-ip-country-region') || '';
  const city = h.get('x-vercel-ip-city') || '';
  return {
    country: /^[A-Z]{2}$/.test(country) ? country : 'XX',
    region: region.slice(0, 60) || null,
    city: city ? decodeURIComponent(city).slice(0, 80) : null,
  };
}

/**
 * neon()'s tagged-template return type is a union that TypeScript cannot iterate
 * directly, so we narrow query results to plain rows at the call site.
 */
const makeSql = () => neon(process.env.DATABASE_URL!);
type SqlClient = ReturnType<typeof makeSql>;
type Row = Record<string, unknown>;
const rowsOf = (r: unknown) => r as Row[];
const num = (v: unknown) => Number(v ?? 0);

let ready = false;
async function ensureTable(sql: SqlClient) {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS upasthiti (
      id          BIGSERIAL PRIMARY KEY,
      ip_hash     TEXT        NOT NULL UNIQUE,
      country     TEXT        NOT NULL DEFAULT 'XX',
      region      TEXT,
      city        TEXT,
      hits        INTEGER     NOT NULL DEFAULT 1,
      first_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS upasthiti_country_idx ON upasthiti (country)`;
  await sql`CREATE INDEX IF NOT EXISTS upasthiti_last_seen_idx ON upasthiti (last_seen DESC)`;
  ready = true;
}

async function snapshot(sql: SqlClient) {
  const [totals] = rowsOf(await sql`
    SELECT COUNT(*)::int AS people,
           COALESCE(SUM(hits), 0)::int AS hits,
           COUNT(DISTINCT country)::int AS countries
    FROM upasthiti
  `);
  const rows = rowsOf(await sql`
    SELECT country, COUNT(*)::int AS people, COALESCE(SUM(hits), 0)::int AS hits
    FROM upasthiti
    GROUP BY country
    ORDER BY people DESC, country ASC
    LIMIT 60
  `);
  const [recent] = rowsOf(await sql`
    SELECT COUNT(*)::int AS c FROM upasthiti WHERE last_seen > NOW() - INTERVAL '24 hours'
  `);
  return {
    people: num(totals?.people),
    hits: num(totals?.hits),
    countries: num(totals?.countries),
    today: num(recent?.c),
    byCountry: rows.map(r => ({ country: String(r.country), people: num(r.people), hits: num(r.hits) })),
  };
}

const EMPTY = { people: 0, hits: 0, countries: 0, today: 0, byCountry: [] as { country: string; people: number; hits: number }[] };

export async function GET() {
  try {
    const sql = makeSql();
    await ensureTable(sql);
    const data = await snapshot(sql);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
    });
  } catch {
    return NextResponse.json(EMPTY, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = makeSql();
    await ensureTable(sql);

    const ipHash = hashIp(clientIp(req));
    const { country, region, city } = geo(req);

    const [row] = rowsOf(await sql`
      INSERT INTO upasthiti (ip_hash, country, region, city)
      VALUES (${ipHash}, ${country}, ${region}, ${city})
      ON CONFLICT (ip_hash) DO UPDATE
        SET hits = upasthiti.hits + 1,
            last_seen = NOW(),
            country = CASE WHEN EXCLUDED.country <> 'XX' THEN EXCLUDED.country ELSE upasthiti.country END,
            region = COALESCE(EXCLUDED.region, upasthiti.region),
            city = COALESCE(EXCLUDED.city, upasthiti.city)
      RETURNING hits, country, (first_seen = last_seen) AS is_new
    `);

    const data = await snapshot(sql);
    return NextResponse.json({
      success: true,
      you: { hits: num(row?.hits), country: String(row?.country ?? 'XX'), isNew: Boolean(row?.is_new) },
      ...data,
    });
  } catch {
    return NextResponse.json({ error: 'उपस्थिति दर्ज नहीं हो सकी। कृपया पुनः प्रयास करें।' }, { status: 500 });
  }
}
