import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const makeSql = () => neon(process.env.DATABASE_URL!);
type SqlClient = ReturnType<typeof makeSql>;
type Row = Record<string, unknown>;
const rows = (r: unknown) => r as Row[];
const num = (v: unknown) => Number(v ?? 0);
const str = (v: unknown) => String(v ?? '');

/**
 * Gated by ADMIN_API_KEY. Timing-safe-ish comparison is overkill here, but we
 * at least avoid leaking whether the key is merely unset.
 */
function authorized(req: NextRequest): boolean {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return false;

  const auth = req.headers.get('authorization');
  if (auth) {
    const [scheme, token] = auth.split(' ');
    if (scheme === 'Bearer' && token === key) return true;
  }
  return new URL(req.url).searchParams.get('key') === key;
}

/** Tables are created lazily elsewhere; tolerate their absence on a fresh DB. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch { return fallback; }
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const sp = new URL(req.url).searchParams;
  const hoursParam = sp.get('hours');
  const daysParam = sp.get('days');
  const hours = hoursParam
    ? Math.min(Math.max(1, parseInt(hoursParam, 10) || 24), 8760)
    : daysParam
      ? Math.min(Math.max(1, parseInt(daysParam, 10) || 1), 365) * 24
      : 24;

  let sql: SqlClient;
  try {
    sql = makeSql();
  } catch {
    return NextResponse.json({ error: 'Database is not configured.' }, { status: 503 });
  }

  const since = new Date(Date.now() - hours * 3600_000);
  const bucket = hours <= 48 ? 'hour' : 'day';

  const [
    totals, topPages, referrers, devices, browsers, countries, utm, daily, visitors,
    memberTotal, memberStates, memberDaily, memberRecent,
    presence, presenceCountries, presenceDaily,
  ] = await Promise.all([
    safe(async () => rows(await sql`
      SELECT COUNT(*)::int AS views, COUNT(DISTINCT session_id)::int AS sessions,
             COUNT(DISTINCT ip_hash)::int AS visitors
      FROM page_views WHERE created_at >= ${since}`)[0], {} as Row),
    safe(async () => rows(await sql`
      SELECT path, COUNT(*)::int AS views FROM page_views
      WHERE created_at >= ${since} GROUP BY path ORDER BY views DESC LIMIT 15`), []),
    safe(async () => rows(await sql`
      SELECT COALESCE(NULLIF(referrer, ''), 'direct') AS referrer, COUNT(*)::int AS views
      FROM page_views WHERE created_at >= ${since}
      GROUP BY 1 ORDER BY views DESC LIMIT 12`), []),
    safe(async () => rows(await sql`
      SELECT COALESCE(device,'unknown') AS device, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= ${since} GROUP BY 1 ORDER BY count DESC`), []),
    safe(async () => rows(await sql`
      SELECT COALESCE(browser,'unknown') AS browser, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= ${since} GROUP BY 1 ORDER BY count DESC LIMIT 8`), []),
    safe(async () => rows(await sql`
      SELECT country, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= ${since} GROUP BY 1 ORDER BY count DESC LIMIT 15`), []),
    safe(async () => rows(await sql`
      SELECT utm_source, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= ${since} AND utm_source IS NOT NULL
      GROUP BY 1 ORDER BY count DESC LIMIT 10`), []),
    safe(async () => rows(await sql`
      SELECT to_char(date_trunc(${bucket}, created_at), 'YYYY-MM-DD HH24:00') AS date,
             COUNT(*)::int AS views
      FROM page_views WHERE created_at >= ${since}
      GROUP BY 1 ORDER BY 1`), []),
    safe(async () => rows(await sql`
      SELECT left(ip_hash, 10) AS visitor, COUNT(*)::int AS count FROM page_views
      WHERE created_at >= ${since} GROUP BY 1 ORDER BY count DESC LIMIT 10`), []),

    safe(async () => rows(await sql`SELECT COUNT(*)::int AS c FROM members`)[0], {} as Row),
    safe(async () => rows(await sql`
      SELECT COALESCE(NULLIF(state,''),'—') AS state, COUNT(*)::int AS count FROM members
      GROUP BY 1 ORDER BY count DESC LIMIT 12`), []),
    safe(async () => rows(await sql`
      SELECT to_char(date_trunc(${bucket}, registered_at), 'YYYY-MM-DD HH24:00') AS date,
             COUNT(*)::int AS count
      FROM members WHERE registered_at >= ${since} GROUP BY 1 ORDER BY 1`), []),
    safe(async () => rows(await sql`
      SELECT sp_id, name, COALESCE(state,'') AS state, registered_at
      FROM members ORDER BY registered_at DESC LIMIT 25`), []),

    safe(async () => rows(await sql`
      SELECT COUNT(*)::int AS people, COALESCE(SUM(hits),0)::int AS hits,
             COUNT(DISTINCT country)::int AS countries
      FROM upasthiti`)[0], {} as Row),
    safe(async () => rows(await sql`
      SELECT country, COUNT(*)::int AS people, COALESCE(SUM(hits),0)::int AS hits
      FROM upasthiti GROUP BY 1 ORDER BY people DESC LIMIT 15`), []),
    safe(async () => rows(await sql`
      SELECT to_char(date_trunc(${bucket}, first_seen), 'YYYY-MM-DD HH24:00') AS date,
             COUNT(*)::int AS count
      FROM upasthiti WHERE first_seen >= ${since} GROUP BY 1 ORDER BY 1`), []),
  ]);

  const membersInPeriod = memberDaily.reduce((a, r) => a + num(r.count), 0);

  return NextResponse.json({
    period: { hours, since: since.toISOString(), bucket },
    traffic: {
      views: num(totals?.views),
      sessions: num(totals?.sessions),
      visitors: num(totals?.visitors),
      topPages: topPages.map(r => ({ path: str(r.path), views: num(r.views) })),
      referrers: referrers.map(r => ({ referrer: str(r.referrer), views: num(r.views) })),
      devices: devices.map(r => ({ device: str(r.device), count: num(r.count) })),
      browsers: browsers.map(r => ({ browser: str(r.browser), count: num(r.count) })),
      countries: countries.map(r => ({ country: str(r.country), count: num(r.count) })),
      utmSources: utm.map(r => ({ utm_source: str(r.utm_source), count: num(r.count) })),
      visitorsTop: visitors.map(r => ({ visitor: str(r.visitor), count: num(r.count) })),
      daily: daily.map(r => ({ date: str(r.date), views: num(r.views) })),
    },
    members: {
      total: num(memberTotal?.c),
      inPeriod: membersInPeriod,
      byState: memberStates.map(r => ({ state: str(r.state), count: num(r.count) })),
      daily: memberDaily.map(r => ({ date: str(r.date), count: num(r.count) })),
      recent: memberRecent.map(r => ({
        sp_id: str(r.sp_id), name: str(r.name), state: str(r.state),
        registered_at: r.registered_at ? new Date(r.registered_at as string).toISOString() : null,
      })),
    },
    upasthiti: {
      people: num(presence?.people),
      hits: num(presence?.hits),
      countries: num(presence?.countries),
      byCountry: presenceCountries.map(r => ({
        country: str(r.country), people: num(r.people), hits: num(r.hits),
      })),
      daily: presenceDaily.map(r => ({ date: str(r.date), count: num(r.count) })),
    },
  }, { headers: { 'Cache-Control': 'no-store' } });
}
