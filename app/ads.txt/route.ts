/** Serves /ads.txt from NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-123 -> pub-123). Empty until configured. */
export const dynamic = 'force-static';

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const body = client
    ? `google.com, ${client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense not configured yet\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
