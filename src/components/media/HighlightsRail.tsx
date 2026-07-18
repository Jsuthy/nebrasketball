import { latestHuskerVideos } from "@/lib/media/youtube";
import LiteVideo from "./LiteVideo";

export default async function HighlightsRail({
  sport,
  title = "Latest Husker Video",
  limit = 3,
}: {
  sport?: string;
  title?: string;
  limit?: number;
}) {
  const videos = await latestHuskerVideos(sport, limit);
  if (videos.length === 0) return null;

  return (
    <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 22,
          fontWeight: 800,
          color: "var(--cream)",
          margin: "0 0 6px",
        }}
      >
        {title}
      </h2>
      <p style={{ color: "var(--faint)", fontSize: 12, margin: "0 0 16px" }}>
        Played via YouTube from the source channels — updates automatically.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          maxWidth: 900,
          gap: 14,
        }}
      >
        {videos.map((video) => (
          <LiteVideo key={video.videoId} videoId={video.videoId} title={video.title} />
        ))}
      </div>
    </section>
  );
}
