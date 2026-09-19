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
    <Link href={`/news/${post.slug}`} className="beat-story" style={{ gridTemplateColumns: "1fr" }}>
      <div>
        <div className="beat-sec">{date}</div>
        <h3>{post.title}</h3>
        {post.excerpt && <span>{post.excerpt}</span>}
      </div>
    </Link>
  );
}
