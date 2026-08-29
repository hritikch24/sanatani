import { BLUR } from './blur';

/**
 * Responsive banner image for article pages.
 *
 * Decorative by default (alt=""), since every banner sits directly above an
 * <h1> that already carries the meaning. Pass `alt` only when the picture adds
 * information the heading does not.
 */
export function Banner({
  name,
  widths,
  sizes = '(max-width: 800px) 100vw, 760px',
  alt = '',
  ratio = '16 / 9',
  priority = false,
  narrow = false,
}: {
  name: string;
  widths: number[];
  sizes?: string;
  alt?: string;
  ratio?: string;
  priority?: boolean;
  /** Caps the width for tall/square art so the <h1> stays above the fold. */
  narrow?: boolean;
}) {
  const set = (ext: string) => widths.map(w => `/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallbackWidth = widths[widths.length - 2] ?? widths[0];

  return (
    <figure
      className={`banner${narrow ? ' banner--narrow' : ''}`}
      style={{ aspectRatio: ratio, backgroundImage: `url("${BLUR[name] ?? ''}")` }}
    >
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
        <img
          src={`/${name}-${fallbackWidth}.jpg`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </picture>
    </figure>
  );
}
