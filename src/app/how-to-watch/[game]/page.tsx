import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import WatchOptions from "@/components/watch/WatchOptions";
import { faqJsonLd, gameJsonLd } from "@/lib/schedule/jsonld";
import {
  getAllGames,
  getGameBySlug,
  formatLongDate,
  formatShortDate,
  matchupTitle,
  venueLine,
  watchSections,
  type GameEntry,
} from "@/lib/schedule/games";

export const revalidate = 1800;

export function generateStaticParams() {
  return getAllGames().map((g) => ({ game: g.slug }));
}

function homeAwayLabel(game: GameEntry): string {
  if (game.homeAway === "home") return "Home";
  if (game.homeAway === "away") return "Away";
  return "Neutral site";
}

function tvAnswer(game: GameEntry): string {
  return game.tv
    ? `Nebraska vs ${game.opponent} airs on ${game.tv}.`
    : `The TV channel for Nebraska vs ${game.opponent} has not been announced yet. It updates on this page as soon as it's set.`;
}

function timeAnswer(game: GameEntry): string {
  return game.time
    ? `Nebraska vs ${game.opponent} is scheduled for ${game.time} on ${formatLongDate(game.date)}.`
    : `The start time for Nebraska vs ${game.opponent} on ${formatLongDate(game.date)} is still to be announced.`;
}

function streamingAnswer(game: GameEntry): string {
  const first = watchSections(game)[0];
  return first.body;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}): Promise<Metadata> {
  const { game: slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return {};

  const date = formatShortDate(game.date);
  const title = `How to Watch Nebraska vs ${game.opponent} — ${date}, TV Channel & Time`;
  const description = `How to watch Nebraska ${game.sportLabel} vs ${game.opponent} on ${formatLongDate(game.date)}: ${game.tv ? `on ${game.tv}, ` : "TV channel, "}${game.time ?? "time TBA"}, streaming options, and where to watch the Huskers.`;

  return {
    title,
    description,
    alternates: { canonical: `/how-to-watch/${game.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/how-to-watch/${game.slug}`,
      type: "article",
    },
  };
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 16px",
};

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 0",
        borderTop: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 12,
          color: "var(--faint)",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--cream)", fontSize: 14, fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}

export default async function HowToWatchGamePage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const pageUrl = `${SITE_URL}/how-to-watch/${game.slug}`;
  const sections = watchSections(game);

  const faqs = [
    {
      q: `What channel is Nebraska vs ${game.opponent} on?`,
      a: tvAnswer(game),
    },
    {
      q: `What time does Nebraska play ${game.opponent}?`,
      a: timeAnswer(game),
    },
    {
      q: `Is Nebraska vs ${game.opponent} on TV or streaming?`,
      a: streamingAnswer(game),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameJsonLd(game, game.sportLabel, pageUrl)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "How to Watch", href: "/how-to-watch" },
          { label: `Nebraska vs ${game.opponent}` },
        ]}
      />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 72px" }}>
        <header style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>
            How to Watch · Nebraska {game.sportLabel} {game.seasonLabel}
          </div>
          <h1
            className="stat-hero"
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            How to Watch Nebraska vs {game.opponent}
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 17,
              lineHeight: 1.6,
              marginTop: 16,
            }}
          >
            {matchupTitle(game)} · {formatLongDate(game.date)}
            {game.time ? ` · ${game.time}` : ""}. {venueLine(game)}{" "}
            {game.tv
              ? `The game airs on ${game.tv}.`
              : "The TV channel hasn't been announced yet — it updates here automatically."}
          </p>
        </header>

        {/* Direct-answer fact box */}
        <section
          style={{
            background: "var(--s1)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 22px 18px",
            marginBottom: 40,
          }}
        >
          <FactRow label="Matchup" value={matchupTitle(game)} />
          <FactRow label="Date" value={formatLongDate(game.date)} />
          <FactRow label="Time (CT)" value={game.time ?? "TBA"} />
          <FactRow label="TV / Stream" value={game.tv ?? "TBA"} />
          <FactRow label="Site" value={homeAwayLabel(game)} />
          <FactRow label="Venue" value={`${game.venue} — ${game.city}`} />
          {game.note && <FactRow label="Note" value={game.note} />}
        </section>

        <WatchOptions game={game} />

        <section style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>How to Watch &amp; Stream</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {sections.map((item) => (
              <div
                key={item.label}
                style={{
                  background: "var(--s1)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "18px 22px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: 15,
                    color: "var(--cream)",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>FAQ</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {faqs.map((f) => (
              <div
                key={f.q}
                style={{
                  background: "var(--s1)",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--red)",
                  borderRadius: 4,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--cream)",
                    marginBottom: 6,
                  }}
                >
                  {f.q}
                </div>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14 }}>
          <Link href={`/${game.sportSlug}`} style={{ color: "var(--red)", fontWeight: 600 }}>
            ← Full Nebraska {game.sportLabel} {game.seasonLabel} schedule
          </Link>
          <Link href="/how-to-watch" style={{ color: "var(--red)", fontWeight: 600 }}>
            Does Nebraska play today? →
          </Link>
        </div>
      </div>
    </>
  );
}
