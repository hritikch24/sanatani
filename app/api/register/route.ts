import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

const clean = (s: string, max = 100) => s.trim().replace(/<[^>]*>/g, '').slice(0, max);

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || '0.0.0.0';

  let body: { name?: unknown; email?: unknown; state?: unknown; consent?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, state, consent } = body;
  if (consent !== true || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name and consent are required' }, { status: 400 });
  }

  const cleanEmail = email && typeof email === 'string' ? clean(email, 150) : null;
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const [rl] = await sql`
      SELECT COUNT(*) AS c FROM members
      WHERE ip = ${ip} AND registered_at > NOW() - INTERVAL '5 minutes'
    `;
    if (Number(rl.c) >= 5) {
      return NextResponse.json({ error: 'बहुत अधिक अनुरोध। कृपया 5 मिनट बाद प्रयास करें।' }, { status: 429 });
    }

    const [tmp] = await sql`
      INSERT INTO members (sp_id, name, email, state, consent, ip)
      VALUES ('SP-00000', ${clean(name)}, ${cleanEmail}, ${state && typeof state === 'string' ? clean(state, 50) : null}, true, ${ip})
      RETURNING id, name, registered_at
    `;
    const sp_id = 'SP-' + String(1000 + Number(tmp.id)).padStart(5, '0');
    await sql`UPDATE members SET sp_id = ${sp_id} WHERE id = ${tmp.id}`;

    return NextResponse.json({ success: true, sp_id, name: tmp.name, registered_at: tmp.registered_at });
  } catch {
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
