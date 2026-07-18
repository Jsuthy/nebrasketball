import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";
import { getNewsPosts } from "@/lib/supabase/queries";
import { FALLBACK_NEWS } from "@/lib/news-data";
import { VOLLEYBALL_2026, FOOTBALL_2026 } from "@/lib/schedule/data";
import { attachResults, nextGame } from "@/lib/schedule/results";
import type { GameWithResult } from "@/lib/schedule/types";
import NewsCard from "@/components/news/NewsCard";
import EmailCapture from "@/components/ui/EmailCapture";
import Disclaimer from "@/components/ui/Disclaimer";
import HighlightsRail from "@/components/media/HighlightsRail";
import XStrip from "@/components/media/XStrip";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Nebrasketball — Husker Schedules, Live Scores & Records",
  description: buildMetaDescription(
    "Nebraska Cornhuskers schedules, live scores, TV info and record tracking for basketball, volleyball and football — updated automatically all season. GBR."
  ),
  openGraph: {
    title: "Nebrasketball — Husker Schedules, Live Scores & Records",
    description: buildMetaDescription(
      "Nebraska schedules, live scores, TV info and records — updated automatically all season."
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

const SPORT_TILES = [
  { slug: "basketball", label: "Basketball" },
  { slug: "volleyball", label: "Volleyball" },
  { slug: "football", label: "Football" },
  { slug: "scores", label: "Live Scores" },
];

function daysUntil(dateIso: string): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const today = Date.UTC(get("year"), get("month") - 1, get("day"));
  const [y, m, d] = dateIso.split("-").map(Number);
  return Math.max(0, Math.round((Date.UTC(y, m - 1, d) - today) / 86400000));
}

async function upcoming(): Promise<{
  game: GameWithResult;
  sportLabel: string;
  path: string;
  days: number;
} | null> {
  const [vb, fb] = await Promise.all([
    attachResults(VOLLEYBALL_2026),
    attachResults(FOOTBALL_2026),
  ]);
  const candidates = [
    { game: nextGame(vb), sportLabel: "Volleyball", path: "/volleyball" },
    { game: nextGame(fb), sportLabel: "Football", path: "/football" },
  ].filter((c): c is { game: GameWithResult; sportLabel: string; path: string } => c.game !== null);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.game.date.localeCompare(b.game.date));
  const next = candidates[0];
  return { ...next, days: daysUntil(next.game.date) };
}

export default async function Home() {
  let newsPosts: unknown[] = [];
  try {
    newsPosts = await getNewsPosts(3);
  } catch {
    // Supabase unavailable
  }
  if (newsPosts.length === 0) {
    newsPosts = FALLBACK_NEWS;
  }

  const next = await upcoming();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nebrasketball",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?q={search_term}`,
      },
      "query-input": "required name=search_term",
    },
  };

  const matchupLine = next
    ? next.game.homeAway === "away"
      ? `Nebraska at ${next.game.opponent}`
      : next.game.homeAway === "neutral"
        ? `Nebraska vs ${next.game.opponent}`
        : `${next.game.opponent} at Nebraska`
    : null;

  const dateLine = next
    ? new Date(
        Number(next.game.date.slice(0, 4)),
        Number(next.game.date.slice(5, 7)) - 1,
        Number(next.game.date.slice(8, 10))
      ).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO — the next Husker event is the front page */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 70% 60% at 75% 20%, rgba(208,0,0,0.16) 0%, transparent 65%)",
        }}
      >
        {/* off-center court lines */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            right: "-15%",
            top: 0,
            width: "70%",
            height: "100%",
            opacity: 0.05,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <circle cx={700} cy={250} r={150} stroke="white" strokeWidth={1.5} fill="none" />
          <circle cx={700} cy={250} r={26} stroke="white" strokeWidth={1.5} fill="none" />
          <line x1={700} y1={0} x2={700} y2={500} stroke="white" strokeWidth={1} />
          <path d="M420 250 Q560 120 700 250" stroke="white" strokeWidth={1} fill="none" />
        </svg>

        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "64px 20px 56px",
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 32,
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>
              {next ? `Next up in Husker ${next.sportLabel}` : "The Unofficial Husker HQ"}
            </div>
            <h1
              className="stat-hero"
              style={{
                fontSize: "clamp(44px, 7.5vw, 88px)",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {next && next.days > 0
                ? `${next.sportLabel} is back ${dateLine?.split(",")[1]?.trim() ?? next.game.date}`
                : matchupLine ?? "Husker schedules, scores & records"}
            </h1>
            {next && (
              <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.6, marginTop: 16 }}>
                {matchupLine} — {dateLine}
                {next.game.time ? ` at ${next.game.time}` : ", time TBA"}, {next.game.venue},{" "}
                {next.game.city}.{" "}
                {next.game.tv ? `Watch on ${next.game.tv}.` : "TV announcement lands here first."}
              </p>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
              <Link
                href={next?.path ?? "/scores"}
                className="btn-angled font-display"
                style={{
                  background: "var(--red)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "14px 30px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {next ? `${next.sportLabel} schedule & how to watch` : "Live scores"}
              </Link>
              <Link
                href="/scores"
                className="btn-outline font-display"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.22)",
                  fontWeight: 800,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "14px 30px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Live scoreboard
              </Link>
            </div>
            <p style={{ marginTop: 22, marginBottom: 0 }}>
              <Disclaimer variant="short" />
            </p>
          </div>

          {/* The one huge thing: countdown */}
          {next && next.days > 0 && (
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                className="stat-hero font-data"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(120px, 16vw, 220px)",
                }}
              >
                {next.days}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  fontSize: 16,
                  color: "var(--accent)",
                  marginTop: 4,
                }}
              >
                Days to go
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STATS STRIP — the 2026 breakthrough */}
      <div style={{ display: "flex", background: "var(--red)", width: "100%", flexWrap: "wrap" }}>
        {STATS.map((stat, i) => (
          <div
            key={stat.lbl}
            style={{
              flex: 1,
              minWidth: 110,
              textAlign: "center",
              padding: "15px 6px",
              borderRight:
                i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none",
            }}
          >
            <span
              className="font-display"
              style={{ fontWeight: 900, fontSize: 28, lineHeight: 1, color: "white", display: "block" }}
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

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 20px 0" }}>
        {/* ASYMMETRIC FEATURES — basketball leads */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link
            href="/basketball"
            className="news-card"
            style={{
              flex: "2 1 400px",
              background: "var(--s1)",
              border: "1px solid rgba(208,0,0,0.45)",
              borderRadius: 6,
              padding: "28px 30px",
              textDecoration: "none",
              color: "var(--text)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="ghost-num" style={{ top: -30, right: -10, fontSize: 200 }} aria-hidden>
              16
            </div>
            <div className="section-label" style={{ marginBottom: 10 }}>
              Basketball · This is Nebrasketball
            </div>
            <div
              className="stat-hero"
              style={{ fontSize: "clamp(30px, 4vw, 44px)", textTransform: "uppercase", maxWidth: 420 }}
            >
              The Sweet 16 rematch is coming to Lincoln
            </div>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 460, marginTop: 12 }}>
              First tournament win ever. First Sweet 16. Now Iowa comes to
              Pinnacle Bank Arena — and so do defending champs Michigan.
              Schedule, roster and rankings, updated as they land.
            </p>
          </Link>

          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Link
              href="/volleyball/attendance"
              className="news-card"
              style={{
                flex: 1,
                background: "var(--s1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "20px 24px",
                textDecoration: "none",
                color: "var(--text)",
              }}
            >
              <div className="section-label" style={{ marginBottom: 8 }}>Volleyball</div>
              <div className="stat-hero" style={{ fontSize: 40 }}>92,003</div>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
                The record book lives in Lincoln. Every mark the Huskers hold,
                plus the full 2026 schedule and TV guide.
              </p>
            </Link>
            <Link
              href="/football"
              className="news-card"
              style={{
                flex: 1,
                background: "var(--s1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "20px 24px",
                textDecoration: "none",
                color: "var(--text)",
              }}
            >
              <div className="section-label" style={{ marginBottom: 8 }}>Football</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: "var(--cream)",
                }}
              >
                Sept 5 vs Ohio — the road to Black Friday
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
                Every kickoff time and channel as the Big Ten announces them.
              </p>
            </Link>
          </div>
        </div>

        {/* MEDIA */}
        <HighlightsRail title="Latest Husker Video" limit={3} />
        <XStrip />

        {/* SPORT TILES */}
        <section className="reveal" style={{ margin: "64px 0 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 10,
            }}
          >
            {SPORT_TILES.map((tile) => (
              <Link
                key={tile.slug}
                href={`/${tile.slug}`}
                className="news-card"
                style={{
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "18px 20px",
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 18,
                  textTransform: "uppercase",
                  color: "var(--cream)",
                  letterSpacing: "0.04em",
                }}
              >
                {tile.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* LATEST NEWS */}
      <section style={{ maxWidth: 1080, margin: "64px auto 0", padding: "0 20px 56px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: 22,
              fontWeight: 800,
              color: "var(--cream)",
              margin: 0,
            }}
          >
            Latest News
          </h2>
          <Link
            href="/news"
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
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

      {/* EMAIL CAPTURE */}
      <section style={{ background: "var(--red)", padding: "52px 20px", textAlign: "center" }}>
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
          Never miss a Husker game
        </h2>
        <p style={{ color: "rgba(255,255,255,0.78)", marginBottom: 24, fontSize: 15 }}>
          Schedule changes, TV announcements and score recaps in your inbox — nothing else.
        </p>
        <EmailCapture />
      </section>
    </>
  );
}
