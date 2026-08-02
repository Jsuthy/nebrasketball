import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  getTodaysGames,
  getNextGame,
  getAllGames,
  todayCT,
  formatLongDate,
  formatShortDate,
  matchupTitle,
  type GameEntry,
} from "@/lib/schedule/games";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Does Nebraska Play Today? — TV Channel, Time & How to Watch",
  description:
    "Does Nebraska play today? Instant yes/no for every Husker sport — volleyball and football — with the TV channel, start time, and how to watch. Updated automatically.",
  alternates: { canonical: "/how-to-watch" },
  openGraph: {
    title: "Does Nebraska Play Today? — TV Channel, Time & How to Watch",
    description:
      "Every Nebraska game across all sports: does Nebraska play today, what channel, what time, and where to watch.",
    url: `${SITE_URL}/how-to-watch`,
    type: "website",
  },
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 16px",
};

function GameCard({ game, featured }: { game: GameEntry; featured?: boolean }) {
  return (
    <Link
      href={`/how-to-watch/${game.slug}`}
      style={{
        display: "block",
        background: "var(--s1)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--red)",
        borderRadius: 6,
        padding: featured ? "22px 24px" : "16px 20px",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 11,
          color: "var(--faint)",
          marginBottom: 6,
        }}
      >
        {game.sportLabel} · {formatShortDate(game.date)}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: featured ? 24 : 18,
          color: "var(--cream)",
          textTransform: "uppercase",
          lineHeight: 1.1,
        }}
      >
        {matchupTitle(game)}
      </div>
      <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 14 }}>
        {game.time ?? "Time TBA"} · {game.tv ? `on ${game.tv}` : "TV TBA"} · {game.venue}
      </div>
      <div style={{ marginTop: 10, color: "var(--red)", fontWeight: 600, fontSize: 13 }}>
        How to watch Nebraska vs {game.opponent} →
      </div>
    </Link>
  );
}

export default function HowToWatchHubPage() {
  const todaysGames = getTodaysGames();
  const playingToday = todaysGames.length > 0;
  const nextGame = getNextGame();
  const today = todayCT();

  // Upcoming across all sports (excluding anything already shown as "today").
  const upcoming = getAllGames()
    .filter((g) => g.date >= today && !todaysGames.includes(g))
    .slice(0, 10);

  const answer = playingToday
    ? `Yes — Nebraska ${todaysGames.length > 1 ? "plays " + todaysGames.length + " games today" : "plays today"}.`
    : "No — Nebraska isn't playing today.";

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "How to Watch" }]}
      />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 72px" }}>
        <header style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>
            Go Big Red · Every Sport
          </div>
          <h1
            className="stat-hero"
            style={{
              fontSize: "clamp(34px, 7vw, 64px)",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.02,
            }}
          >
            Does Nebraska Play Today?
          </h1>
          <p
            style={{
              color: playingToday ? "var(--cream)" : "var(--muted)",
              fontSize: 20,
              fontWeight: 700,
              marginTop: 18,
            }}
          >
            {answer}
          </p>
        </header>

        {playingToday ? (
          <section style={{ marginBottom: 44 }}>
            <h2 style={sectionTitle}>Today&apos;s Nebraska Games</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {todaysGames.map((g) => (
                <GameCard key={g.slug} game={g} featured />
              ))}
            </div>
          </section>
        ) : (
          nextGame && (
            <section style={{ marginBottom: 44 }}>
              <h2 style={sectionTitle}>Next Up</h2>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px" }}>
                Nebraska&apos;s next game is {formatLongDate(nextGame.date)}.
              </p>
              <GameCard game={nextGame} featured />
            </section>
          )
        )}

        {upcoming.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={sectionTitle}>Upcoming — All Sports</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {upcoming.map((g) => (
                <GameCard key={g.slug} game={g} />
              ))}
            </div>
          </section>
        )}

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14 }}>
          <Link href="/volleyball" style={{ color: "var(--red)", fontWeight: 600 }}>
            Nebraska Volleyball schedule →
          </Link>
          <Link href="/football" style={{ color: "var(--red)", fontWeight: 600 }}>
            Nebraska Football schedule →
          </Link>
        </div>
      </div>
    </>
  );
}
