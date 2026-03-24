import type { Metadata } from "next";
import { getNewsPosts } from "@/lib/supabase/queries";
import { FALLBACK_NEWS } from "@/lib/news-data";
import NewsCard from "@/components/news/NewsCard";

export const metadata: Metadata = {
  title: "Nebraska Basketball News & Updates",
  description:
    "Latest Nebraska Cornhuskers basketball news, game recaps, and updates. Follow the Huskers' historic 2026 March Madness run.",
};

export default async function NewsPage() {
  let posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string;
  }> = [];

  try {
    posts = await getNewsPosts();
  } catch {
    // Supabase unavailable
  }

  if (posts.length === 0) {
    posts = FALLBACK_NEWS;
  }

  return (
    <section style={{ padding: "40px 20px" }}>
      <span
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--red)",
          display: "block",
          marginBottom: 6,
        }}
      >
        Nebraska Basketball
      </span>
      <h1
        className="font-display"
        style={{
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 48px)",
          textTransform: "uppercase",
          lineHeight: 0.9,
          margin: "0 0 24px",
        }}
      >
        Latest News
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {posts.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
