// Loads Barlow Condensed TTFs for ImageResponse (Satori needs raw font data).
// Google Fonts serves TTF urls in the CSS when no browser UA is sent.

async function fetchTtf(cssUrl: string): Promise<ArrayBuffer> {
  const css = await fetch(cssUrl, { next: { revalidate: 86400 } }).then((r) =>
    r.text()
  );
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!match) throw new Error(`No TTF url found in ${cssUrl}`);
  return fetch(match[1], { next: { revalidate: 86400 } }).then((r) =>
    r.arrayBuffer()
  );
}

export async function barlowCondensed900(): Promise<ArrayBuffer> {
  return fetchTtf(
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@900"
  );
}

export async function barlowCondensed600(): Promise<ArrayBuffer> {
  return fetchTtf(
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600"
  );
}
