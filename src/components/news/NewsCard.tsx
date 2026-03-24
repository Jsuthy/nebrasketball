import Link from "next/link";

interface NewsItem {
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
}

export default function NewsCard({ post }: { post: NewsItem }) {
  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/news/${post.slug}`}
      className="news-card"
      style={{
        background: "var(--s1)",
        borderTop: "3px solid var(--red)",
        padding: 20,
        cursor: "pointer",
        display: "block",
        textDecoration: "none",
        color: "inherit",
        transition: "background 0.2s",
      }}
    >
      <div
        className="font-display"
        style={{
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--red)",
          marginBottom: 7,
        }}
      >
        {date}
      </div>
      <div
        className="font-display"
        style={{
          fontWeight: 800,
          fontSize: 17,
          textTransform: "uppercase",
          lineHeight: 1.1,
          marginBottom: 7,
          color: "white",
        }}
      >
        {post.title}
      </div>
      {post.excerpt && (
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}
