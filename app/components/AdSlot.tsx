'use client';
import { useEffect, useRef } from 'react';

/**
 * Google AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT
 * (ca-pub-XXXXXXXXXXXXXXXX) is set, so the site stays ad-free and clean until
 * the AdSense account is approved. Space is reserved (min-height) to keep CLS at 0.
 * Optional NEXT_PUBLIC_ADSENSE_SLOT sets a default ad-unit id; pass `slot` per placement.
 */
export default function AdSlot({ slot, format = 'auto', minHeight = 280 }: { slot?: string; format?: string; minHeight?: number }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const unit = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT;
  const pushed = useRef(false);
  useEffect(() => {
    if (!client || !unit || pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* ad blockers etc. */ }
  }, [client, unit]);
  if (!client || !unit) return null;
  return (
    <aside className="ad-slot" aria-label="विज्ञापन" style={{ minHeight }}>
      <span className="ad-label">विज्ञापन</span>
      <ins className="adsbygoogle" style={{ display: 'block', minHeight }} data-ad-client={client} data-ad-slot={unit} data-ad-format={format} data-full-width-responsive="true" />
    </aside>
  );
}
