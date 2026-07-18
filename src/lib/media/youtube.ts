// Auto-updating Husker video via YouTube channel RSS feeds — no API key,
// no quota. Embedding published YouTube videos is permitted by YouTube's
// terms; the video itself stays on YouTube's servers.

const FEEDS: Array<{
  channelId: string;
  channel: string;
  sports: string[];
  /** Multi-team channels (BTN) only count when the title names Nebraska. */
  requireNebraska?: boolean;
}> = [
  // "Nebraska Huskers" — the ACTIVE official athletic department channel
  // (@Huskers, posts daily; the older @HuskersAthletics channel is dormant)
  { channelId: "UCMqWeJDl7yjblwPKVNo4XfA", channel: "Nebraska Huskers", sports: ["all"] },
  // Big Ten Network — covers every league team, so Nebraska-filtered
  { channelId: "UC4LeRw7pIZ_kseS4Krn_DQA", channel: "Big Ten Network", sports: ["all"], requireNebraska: true },
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
 * With a sport filter, ONLY sport-matched videos are returned (a volleyball
 * clip must never appear under a "basketball video" heading) — callers hide
 * the rail when the list comes back empty. Without a filter, everything.
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

  const isNebraska = (title: string) => /nebraska|husker/i.test(title);

  const all = results
    .flat()
    .filter((v) => {
      const feed = FEEDS.find((f) => f.channel === v.channel);
      return !feed?.requireNebraska || isNebraska(v.title);
    })
    .sort((a, b) => b.published.localeCompare(a.published));

  if (!sport) return all.slice(0, limit);

  return all
    .filter((v) => {
      const feed = FEEDS.find((f) => f.channel === v.channel);
      const dedicated = feed?.sports.includes(sport);
      return dedicated || v.title.toLowerCase().includes(sport);
    })
    .slice(0, limit);
}
