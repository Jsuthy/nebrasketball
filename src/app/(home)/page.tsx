import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SPORTS, SITE_URL } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";
import { getFeaturedProducts, getNewsPosts } from "@/lib/supabase/queries";
import { FALLBACK_NEWS } from "@/lib/news-data";
import seedProducts from "@/lib/seed-products.json";
import MiniProductCard from "@/components/products/MiniProductCard";
import NewsCard from "@/components/news/NewsCard";
import EmailCapture from "@/components/ui/EmailCapture";
import Disclaimer from "@/components/ui/Disclaimer";

export const metadata: Metadata = {
  title: "Nebrasketball — Nebraska Huskers Schedules, Scores & How to Watch",
  description: buildMetaDescription(
    "Every Nebraska Cornhuskers schedule, score, ranking and broadcast — football, basketball, volleyball and more, updated automatically. GBR!"
  ),
  keywords:
    "nebraska cornhuskers schedule, nebraska basketball scores, nebraska volleyball schedule, husker football tv schedule, nebraska live scores",
  openGraph: {
    title: "Nebrasketball — Nebraska Huskers Schedules, Scores & How to Watch",
    description: buildMetaDescription(
      "Every Nebraska Cornhuskers schedule, score and broadcast — updated automatically."
    ),
    url: SITE_URL,
    type: "website",
  },
};

const STATS = [
  { num: "26", lbl: "Season Wins" },
  { num: "#4", lbl: "NCAA Seed" },
  { num: "S16", lbl: "First Ever" },
  { num: "20", lbl: "Win Streak" },
  { num: "GBR", lbl: "Go Big Red" },
];

export default async function Home() {
  let featuredProducts: unknown[] = [];
  try {
    featuredProducts = await getFeaturedProducts(12);
  } catch {
    // Supabase unavailable
  }
  if (featuredProducts.length === 0) {
    featuredProducts = seedProducts.filter((p) => p.is_featured);
  }

  let newsPosts: unknown[] = [];
  try {
    newsPosts = await getNewsPosts(3);
  } catch {
    // Supabase unavailable
  }
  if (newsPosts.length === 0) {
    newsPosts = FALLBACK_NEWS;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nebrasketball",
    url: SITE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. ANNOUNCEMENT BANNER */}
      <Link
        href="/scores"
        style={{
          display: "block",
          background: "var(--red)",
          color: "white",
          padding: "9px 16px",
          textAlign: "center",
          textDecoration: "none",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        ALL SPORTS LIVE — Schedules, scores & how to watch every Husker team →
      </Link>

      {/* 2. HERO SECTION */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "60px 20px 48px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(208,0,0,0.12) 0%, transparent 70%)",
        }}
      >
        {/* Court lines SVG */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.035,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <circle cx={500} cy={250} r={120} stroke="white" strokeWidth={1.5} fill="none" />
          <circle cx={500} cy={250} r={20} stroke="white" strokeWidth={1.5} fill="none" />
          <line x1={500} y1={0} x2={500} y2={500} stroke="white" strokeWidth={1} />
          <rect x={60} y={130} width={180} height={240} stroke="white" strokeWidth={1.2} fill="none" />
          <rect x={760} y={130} width={180} height={240} stroke="white" strokeWidth={1.2} fill="none" />
          <path d="M60 250 Q150 165 240 250" stroke="white" strokeWidth={1} fill="none" />
          <path d="M760 250 Q850 165 940 250" stroke="white" strokeWidth={1} fill="none" />
        </svg>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Image
            src="/logos/logo-stacked.png"
            alt="Nebrasketball"
            width={340}
            height={154}
            priority
            unoptimized
            style={{
              display: "block",
              margin: "0 auto 28px",
              filter:
                "drop-shadow(0 0 40px rgba(208,0,0,0.55)) drop-shadow(0 4px 20px rgba(0,0,0,0.9))",
              maxWidth: "100%",
              height: "auto",
            }}
          />

          {/* Eyebrow pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              border: "1px solid rgba(208,0,0,0.4)",
              padding: "5px 16px",
              marginBottom: 12,
            }}
          >
            <span
              className="pulse"
              style={{
                width: 6,
                height: 6,
                background: "var(--red)",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              All Sports · Every Fan · GBR
            </span>
          </div>

          <Disclaimer variant="short" />

          <p
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(13px, 2.4vw, 17px)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 30,
              marginTop: 8,
            }}
          >
            Every Nebraska Cornhuskers schedule, score & broadcast — all in one place
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/scores"
              className="btn-angled font-display"
              style={{
                background: "var(--red)",
                color: "white",
                fontWeight: 800,
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "14px 36px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Live Scores
            </Link>
            <Link
              href="/news"
              className="btn-angled font-display"
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.22)",
                fontWeight: 800,
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "14px 36px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>

      {/* 2b. SPORTS HUB — schedules, scores, trackers */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "10px 20px 44px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              href: "/basketball",
              label: "Basketball",
              blurb: "The Sweet 16 run was just the start. Schedule, scores & rankings.",
              featured: true,
            },
            {
              href: "/volleyball",
              label: "Volleyball",
              blurb: "2026 schedule, TV info & the attendance record tracker.",
              featured: false,
            },
            {
              href: "/football",
              label: "Football",
              blurb: "2026 schedule, kickoff times & how to watch every game.",
              featured: false,
            },
            {
              href: "/scores",
              label: "Live Scores",
              blurb: "Husker scoreboard across every sport, updated every minute.",
              featured: false,
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="news-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "var(--text)",
                border: card.featured
                  ? "1px solid rgba(208,0,0,0.5)"
                  : "1px solid var(--border)",
                borderTop: card.featured
                  ? "3px solid var(--red)"
                  : "3px solid transparent",
                borderRadius: 4,
                background: "var(--s1)",
                padding: "16px 18px",
              }}
            >
              <div
                className="font-display"
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                {card.label}
              </div>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
                {card.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. STATS BAR */}
      <div
        style={{
          display: "flex",
          background: "var(--red)",
          width: "100%",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.lbl}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "15px 6px",
              borderRight:
                i < STATS.length - 1
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "none",
            }}
          >
            <span
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: 28,
                lineHeight: 1,
                color: "white",
                display: "block",
              }}
            >
              {stat.num}
            </span>
            <span
              className="font-display"
              style={{
                fontWeight: 600,
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                display: "block",
                marginTop: 3,
              }}
            >
              {stat.lbl}
            </span>
          </div>
        ))}
      </div>

      {/* 5. SPORTS GRID */}
      <section style={{ background: "var(--black)", padding: "40px 20px" }}>
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
          Browse by Sport
        </span>
        <h2
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 48px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            margin: "0 0 18px",
          }}
        >
          Every Husker Sport
        </h2>

        <div className="sports-grid-home">
          <style>{`
            .sports-grid-home {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 2px;
            }
            @media (max-width: 640px) {
              .sports-grid-home {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            .sport-card-home:hover .sport-emoji-home {
              transform: scale(1.08);
            }
          `}</style>
          {SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              href={["football","basketball","volleyball"].includes(sport.slug) ? `/${sport.slug}` : "/scores"}
              className="sport-card-home"
              style={{
                aspectRatio: "4/3",
                background: "var(--s2)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                className="sport-emoji-home"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 56,
                  fontWeight: 900,
                  color: "var(--red)",
                  transition: "transform 0.3s",
                }}
                aria-hidden="true"
              >
                {sport.name.replace("Nebraska ", "").charAt(0)}
              </span>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, transparent 60%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "14px 16px",
                  width: "100%",
                  alignSelf: "flex-end",
                }}
              >
                <span
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontSize: 22,
                    textTransform: "uppercase",
                    color: "white",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {sport.name.replace("Nebraska ", "")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LATEST NEWS */}
      <section style={{ background: "var(--s1)", padding: "40px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div>
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
              Nebraska Cornhuskers
            </span>
            <h2
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: "clamp(28px, 5vw, 48px)",
                textTransform: "uppercase",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              Latest News
            </h2>
          </div>
          <Link
            href="/news"
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--red)",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            All News →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(newsPosts as any[]).map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* 7. EMAIL CAPTURE */}
      <section
        style={{
          background: "var(--red)",
          padding: "52px 20px",
          textAlign: "center",
        }}
      >
        <span
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
            display: "block",
            marginBottom: 6,
          }}
        >
          Stay in the Game
        </span>
        <h2
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(30px, 6vw, 54px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            margin: "0 0 12px",
            color: "white",
          }}
        >
          Get Husker Drop Alerts
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            marginBottom: 24,
            fontSize: 15,
          }}
        >
          Schedules, scores and Husker news in your inbox — nothing else.
        </p>
        <EmailCapture />
      </section>
    </>
  );
}
