// Shared brand marks for ImageResponse rendering (Satori: flexbox + inline SVG).
// The ball mark is an original geometric basketball — deliberately distinct
// from any University of Nebraska registered mark.

export const SCARLET = "#D00000";
export const SCARLET_DK = "#9A0000";
export const CREAM = "#F5F1E7";
export const INK = "#121212";

/** Geometric basketball: circle + vertical seam + two side arcs. */
export function BallMark({ size, ball = CREAM, seams = SCARLET }: {
  size: number;
  ball?: string;
  seams?: string;
}) {
  const sw = Math.max(4, Math.round(size * 0.055));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "flex" }}
    >
      <circle cx="50" cy="50" r={50 - sw / 2} fill={ball} />
      <line x1="50" y1={sw / 2} x2="50" y2={100 - sw / 2} stroke={seams} strokeWidth={sw} />
      <line x1={sw / 2} y1="50" x2={100 - sw / 2} y2="50" stroke={seams} strokeWidth={sw} />
      <path d={`M 14 14 A 62 62 0 0 1 14 86`} fill="none" stroke={seams} strokeWidth={sw} />
      <path d={`M 86 14 A 62 62 0 0 0 86 86`} fill="none" stroke={seams} strokeWidth={sw} />
      <circle cx="50" cy="50" r={50 - sw / 2} fill="none" stroke={seams} strokeWidth={sw} />
    </svg>
  );
}

/** Scarlet badge with clipped corners holding the ball mark. Pure SVG so it
 * renders identically at every size under Satori. */
export function BadgeMark({ size }: { size: number }) {
  // 100-unit viewBox; corners clipped 14 units; ball spans 62 units.
  const sw = 3.4;
  const ball = (d: string) => (
    <path d={d} fill="none" stroke={SCARLET_DK} strokeWidth={sw} />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "flex" }}>
      <defs>
        <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SCARLET} />
          <stop offset="100%" stopColor={SCARLET_DK} />
        </linearGradient>
      </defs>
      <polygon points="0,0 86,0 100,14 100,100 14,100 0,86" fill="url(#badge)" />
      <circle cx="50" cy="50" r="31" fill={CREAM} />
      <line x1="50" y1="19" x2="50" y2="81" stroke={SCARLET_DK} strokeWidth={sw} />
      <line x1="19" y1="50" x2="81" y2="50" stroke={SCARLET_DK} strokeWidth={sw} />
      {ball("M 27.7 27.7 A 38.4 38.4 0 0 1 27.7 72.3")}
      {ball("M 72.3 27.7 A 38.4 38.4 0 0 0 72.3 72.3")}
      <circle cx="50" cy="50" r="31" fill="none" stroke={SCARLET_DK} strokeWidth={sw} />
    </svg>
  );
}
