// Auto-updating Husker video via YouTube channel RSS feeds — no API key,
// no quota. Embedding published YouTube videos is permitted by YouTube's
// terms; the video itself stays on YouTube's servers.

const FEEDS: Array<{ channelId: string; channel: string; sports: string[] }> = [
  // Official Nebraska athletic department channel
  { channelId: "UCzOjbO6SC1TGtlIu2BC5YNQ", channel: "Huskers Athletics", sports: ["all"] },
  // Volleyball-focused channel
  { channelId: "UCTy80DWfhwVJYG4iodp5Omw", channel: "Nebraska Volleyball", sports: ["volleyball"] },
];

export interface HuskerVideo {
  videoId: string;
  title: string;
  published: string;
  channel: string;
}

function parseFeed(xml: string, channel: string): HuskerVideo[] {
  const entries = xml.split("<entry>").slice(1);
  return entries
    .map((entry) => {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      return videoId ? { videoId, title, published, channel } : null;
    })
    .filter((v): v is HuskerVideo => v !== null);
}

/**
 * Latest videos across the configured channels, newest first.
 * Pass a sport ("volleyball" | "football" | "basketball") to prefer
 * sport-matched channels/titles; falls back to everything if the filter
 * would leave the rail empty (offseason).
 */
export async function latestHuskerVideos(
  sport?: string,
  limit = 6
): Promise<HuskerVideo[]> {
  const results = await Promise.all(
    FEEDS.map(async ({ channelId, channel }) => {
      try {
        const res = await fetch(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
          { next: { revalidate: 1800 } }
        );
        if (!res.ok) return [];
        return parseFeed(await res.text(), channel);
      } catch {
        return [];
      }
    })
  );

  const all = results
    .flat()
    .sort((a, b) => b.published.localeCompare(a.published));

  if (sport) {
    const matched = all.filter((v) => {
      const feed = FEEDS.find((f) => f.channel === v.channel);
      return (
        feed?.sports.includes(sport) ||
        v.title.toLowerCase().includes(sport)
      );
    });
    if (matched.length >= 2) return matched.slice(0, limit);
  }
  return all.slice(0, limit);
}
