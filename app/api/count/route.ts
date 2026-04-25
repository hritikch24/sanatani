import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM members`;
    return NextResponse.json(
      { count: 1001 + Number(count) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' } },
    );
  } catch {
    return NextResponse.json({ count: 1001 }, { status: 200 });
  }
}
