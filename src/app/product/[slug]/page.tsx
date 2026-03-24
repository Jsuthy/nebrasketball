import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import {
  getProductBySlug,
  getProducts,
  getProductsByCategory,
} from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import { formatPrice, capFirst, truncate } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import MiniProductCard from "@/components/products/MiniProductCard";
import ProductCTA from "./ProductCTA";

export const revalidate = 21600;

export async function generateStaticParams() {
  let slugs: { slug: string }[] = [];
  try {
    const products = await getProducts();
    slugs = products.map((p) => ({ slug: p.slug }));
  } catch {
    // Supabase unavailable
  }
  if (slugs.length === 0) {
    slugs = seedProducts.map((p) => ({ slug: p.slug }));
  }
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let product = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    // fallback
  }
  if (!product) {
    const seed = seedProducts.find((p) => p.slug === slug);
    if (seed) {
      return {
        title: `${seed.title}`,
        description: `${seed.description} Find Nebraska basketball gear at Nebrasketball.`,
        openGraph: {
          title: `${seed.title}`,
          description: `${seed.description} Find Nebraska basketball gear at Nebrasketball.`,
          images: ["/logos/logo-stacked.png"],
        },
      };
    }
    return {};
  }

  return {
    title: `${product.title}`,
    description: `${product.description || ""} Find Nebraska basketball gear at Nebrasketball.`,
    openGraph: {
      title: `${product.title}`,
      description: `${product.description || ""} Find Nebraska basketball gear at Nebrasketball.`,
      images: [product.image_url || "/logos/logo-stacked.png"],
    },
  };
}

// Unified product shape for rendering
interface DisplayProduct {
  id: string;
  title: string;
  price: number | null;
  originalPrice: number | null;
  imageUrl: string | null;
  source: string;
  slug: string;
  category: string | null;
  description: string | null;
  affiliateUrl: string;
  emoji: string;
  clickCount: number;
  isFeatured: boolean;
}

function toDisplayProduct(
  dbProduct: Awaited<ReturnType<typeof getProductBySlug>> | null,
  seedProduct: (typeof seedProducts)[number] | undefined
): DisplayProduct | null {
  if (dbProduct) {
    const seed = seedProducts.find((s) => s.slug === dbProduct.slug);
    return {
      id: dbProduct.id,
      title: dbProduct.title,
      price: dbProduct.price,
      originalPrice: dbProduct.original_price,
      imageUrl: dbProduct.image_url,
      source: dbProduct.source,
      slug: dbProduct.slug,
      category: dbProduct.category,
      description: dbProduct.description,
      affiliateUrl: dbProduct.affiliate_url,
      emoji: seed?.emoji ?? "🏀",
      clickCount: dbProduct.click_count,
      isFeatured: dbProduct.is_featured,
    };
  }
  if (seedProduct) {
    return {
      id: seedProduct.id,
      title: seedProduct.title,
      price: seedProduct.price,
      originalPrice: seedProduct.was,
      imageUrl: null,
      source: seedProduct.source,
      slug: seedProduct.slug,
      category: seedProduct.category,
      description: seedProduct.description,
      affiliateUrl: seedProduct.affiliate_url,
      emoji: seedProduct.emoji,
      clickCount: seedProduct.clicks,
      isFeatured: seedProduct.is_featured,
    };
  }
  return null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dbProduct = null;
  try {
    dbProduct = await getProductBySlug(slug);
  } catch {
    // Supabase unavailable
  }

  const seedProduct = seedProducts.find((p) => p.slug === slug);
  const product = toDisplayProduct(dbProduct, seedProduct);
  if (!product) notFound();

  const categoryMeta = CATEGORIES.find((c) => c.slug === product.category);
  const categoryName = categoryMeta?.name ?? capFirst(product.category ?? "Gear");

  // Similar products
  let similarRaw: unknown[] = [];
  if (product.category) {
    try {
      similarRaw = await getProductsByCategory(product.category);
    } catch {
      // fallback
    }
  }
  if (similarRaw.length === 0 && product.category) {
    similarRaw = seedProducts.filter(
      (p) => p.category === product.category
    );
  }
  // Filter out current product, take random 4
  const similarFiltered = (similarRaw as Array<{ id: string; slug: string }>).filter(
    (p) => p.id !== product.id && p.slug !== product.slug
  );
  const similar = similarFiltered
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.imageUrl || `${SITE_URL}/logos/logo-stacked.png`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.affiliateUrl,
      seller: {
        "@type": "Organization",
        name: capFirst(product.source),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          {
            label: categoryName,
            href: `/category/${product.category}`,
          },
          { label: truncate(product.title, 32) },
        ]}
      />

      <div
        className="product-layout"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        <div className="product-grid">
          {/* LEFT — Image */}
          <div
            style={{
              aspectRatio: "1",
              background: "var(--s2)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            ) : (
              <span style={{ fontSize: 96 }}>{product.emoji}</span>
            )}
            <span
              className={`badge-${product.source}`}
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 11,
                padding: "3px 10px",
                textTransform: "uppercase",
                zIndex: 1,
              }}
            >
              {product.source}
            </span>
          </div>

          {/* RIGHT — Info */}
          <div>
            <span
              className={`badge-${product.source}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 11,
                padding: "3px 10px",
                display: "inline-block",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              {product.source}
            </span>

            <h1
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: "clamp(22px, 4vw, 32px)",
                textTransform: "uppercase",
                lineHeight: 1.05,
                marginBottom: 12,
                marginTop: 0,
              }}
            >
              {product.title}
            </h1>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                className="font-display"
                style={{ fontWeight: 900, fontSize: 36, color: "white" }}
              >
                {product.price != null ? formatPrice(product.price) : "—"}
              </span>
              {product.originalPrice != null && (
                <span
                  style={{
                    fontSize: 18,
                    color: "var(--muted)",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#4CAF50",
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              ✓ In Stock — Ships Fast
            </div>

            {product.description && (
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 24,
                  marginTop: 0,
                }}
              >
                {product.description}
              </p>
            )}

            <ProductCTA
              affiliateUrl={product.affiliateUrl}
              source={product.source}
              productId={product.id}
            />

            {/* Trust row */}
            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 12,
                color: "var(--muted)",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <span>🔒 Secure checkout</span>
              <span>↩ Easy returns</span>
              <span>🚚 Fast shipping</span>
            </div>

            {/* Affiliate disclaimer */}
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              * Clicking above takes you to {capFirst(product.source)}. We may
              earn a commission.
            </p>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: 28,
                textTransform: "uppercase",
                marginBottom: 4,
                marginTop: 0,
              }}
            >
              Similar Gear
            </h2>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border)",
                marginBottom: 20,
              }}
            />
            <div className="similar-grid">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(similar as any[]).map((p) => (
                <MiniProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .similar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
          .similar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
