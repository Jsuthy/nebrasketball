import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsPost, getNewsPosts, getFeaturedProducts } from "@/lib/supabase/queries";
import { FALLBACK_NEWS } from "@/lib/news-data";
import { SITE_URL } from "@/lib/constants";
import seedProducts from "@/lib/seed-products.json";
import MiniProductCard from "@/components/products/MiniProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  let slugs: { slug: string }[] = [];
  try {
    const posts = await getNewsPosts();
    slugs = posts.map((p) => ({ slug: p.slug }));
  } catch {
    // fallback
  }
  if (slugs.length === 0) {
    slugs = FALLBACK_NEWS.map((p) => ({ slug: p.slug }));
  }
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let post = null;
  try {
    post = await getNewsPost(slug);
  } catch {
    // fallback
  }

  if (!post) {
    const fallback = FALLBACK_NEWS.find((p) => p.slug === slug);
    if (fallback) {
      return {
        title: fallback.title,
        description: fallback.excerpt,
        openGraph: { title: fallback.title, description: fallback.excerpt ?? undefined },
      };
    }
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: {
    slug: string;
    title: string;
    content: string;
    excerpt: string | null;
    published_at: string;
  } | null = null;

  try {
    post = await getNewsPost(slug);
  } catch {
    // fallback
  }

  if (!post) {
    const fallback = FALLBACK_NEWS.find((p) => p.slug === slug);
    if (!fallback) notFound();
    post = fallback;
  }

  const date = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Related products
  let relatedProducts: unknown[] = [];
  try {
    relatedProducts = await getFeaturedProducts(4);
  } catch {
    // fallback
  }
  if ((relatedProducts as unknown[]).length === 0) {
    relatedProducts = seedProducts.filter((p) => p.is_featured).slice(0, 4);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { "@type": "Organization", name: "Nebrasketball" },
    publisher: {
      "@type": "Organization",
      name: "Nebrasketball",
      logo: `${SITE_URL}/logos/logo-icon.png`,
    },
    description: post.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px" }}>
        {/* Back link */}
        <Link
          href="/news"
          className="font-display back-to-news"
          style={{
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--red)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
          }}
        >
          ← Back to News
        </Link>

        <div
          className="font-display"
          style={{
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--red)",
            marginBottom: 10,
          }}
        >
          {date}
        </div>

        <h1
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 44px)",
            textTransform: "uppercase",
            lineHeight: 0.95,
            marginBottom: 20,
            marginTop: 0,
          }}
        >
          {post.title}
        </h1>

        {/* Article body */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Gear CTA box */}
        <div
          style={{
            background: "var(--s1)",
            border: "1px solid rgba(209,31,58,0.3)",
            padding: 22,
            margin: "28px 0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--muted)",
              fontSize: 13,
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Celebrate the run with Nebraska basketball gear.
          </p>
          <Link
            href="/shop"
            className="btn-angled font-display"
            style={{
              background: "var(--red)",
              color: "white",
              fontWeight: 800,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "12px 28px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Browse All Husker Gear →
          </Link>
        </div>

        {/* Related gear */}
        {(relatedProducts as unknown[]).length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: 24,
                textTransform: "uppercase",
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              Related Gear
            </h3>
            <div className="related-gear-grid">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(relatedProducts as any[]).map((p) => (
                <MiniProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </article>

      <style>{`
        .article-prose {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.68);
        }
        .article-prose p {
          margin-bottom: 16px;
        }
        .article-prose strong {
          color: white;
          font-weight: 600;
        }
        .article-prose a {
          color: var(--red);
          text-decoration: underline;
        }
        .article-prose em {
          font-style: italic;
        }
        .back-to-news:hover {
          text-decoration: underline;
        }
        .related-gear-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        @media (max-width: 640px) {
          .related-gear-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
