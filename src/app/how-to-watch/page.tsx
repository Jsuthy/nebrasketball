import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import WatchOptions from "@/components/watch/WatchOptions";
import EmailCapture from "@/components/ui/EmailCapture";
import Disclaimer from "@/components/ui/Disclaimer";
import {
  getTodaysGames,
  getNextGame,
  getNextGameForSport,
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
    "Does Nebraska play today? Men’s basketball first — TV channel, start time, and streaming options for every Husker game. Affiliate links — we may earn a commission. Independent fan site. Not affiliated with UNL or NCAA.",
  alternates: { canonical: "/how-to-watch" },
  openGraph: {
    title: "Does Nebraska Play Today? — TV Channel, Time & How to Watch",
    description:
      "Nebraska men’s basketball how to watch, plus volleyball and football: channel, time, and streaming options.",
    url: `${SITE_URL}/how-to-watch`,
    type: "website",
  },
};

function GameCard({ game, featured }: { game: GameEntry; featured?: boolean }) {
  return (
    <Link
      href={`/how-to-watch/${game.slug}`}
      className="beat-story"
      style={{
        gridTemplateColumns: "1fr",
        padding: featured ? "12px 14px" : "8px",
      }}
    >
      <div>
        <div className="beat-sec">
          {game.sportLabel} · {formatShortDate(game.date)}
        </div>
        <h3 style={{ fontSize: featured ? 20 : 16 }}>{matchupTitle(game)}</h3>
        <span>
          {game.time ?? "Time TBA"} · {game.tv ? `on ${game.tv}` : "TV TBA"} · {game.venue}
        </span>
      </div>
    </Link>
  );
}

export default function HowToWatchHubPage() {
  const todaysGames = getTodaysGames();
  const playingToday = todaysGames.length > 0;
  const nextGame = getNextGame();
  const nextBasketball = getNextGameForSport("basketball");
  const today = todayCT();
  const featuredNext = nextBasketball ?? nextGame;
  const featuredWatch = playingToday
    ? todaysGames.find((g) => g.sportSlug === "basketball") ?? todaysGames[0]
    : featuredNext;

  const todaySlugs = new Set(todaysGames.map((g) => g.slug));
  const upcoming = getAllGames()
    .filter((g) => g.date >= today && !todaySlugs.has(g.slug))
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      if (a.sportSlug === "basketball" && b.sportSlug !== "basketball") return -1;
      if (b.sportSlug === "basketball" && a.sportSlug !== "basketball") return 1;
      return 0;
    })
    .slice(0, 10);

  const answer = playingToday
    ? `Yes — Nebraska ${todaysGames.length > 1 ? "plays " + todaysGames.length + " games today" : "plays today"}.`
    : "No — Nebraska isn't playing today.";

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "How to Watch" }]}
      />

      <div className="beat-wrap" style={{ paddingTop: 8 }}>
        <div className="beat-stack">
          <div>
            <article className="beat-lead">
              <div className="beat-pad">
                <div className="beat-sec">How to watch · men’s basketball first</div>
                <h1>Does Nebraska play today?</h1>
                <p className="beat-dek" style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {answer}
                </p>
                {featuredNext && !playingToday && (
                  <p style={{ margin: "10px 0 0", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    Next {featuredNext.sportLabel.toLowerCase()} is{" "}
                    {formatLongDate(featuredNext.date)}. Channel posts in the rail
                    as a native affiliate module — not a signup modal.
                  </p>
                )}
              </div>
            </article>

            <div className="beat-river">
              {playingToday
                ? todaysGames.map((g) => <GameCard key={g.slug} game={g} featured />)
                : featuredNext && <GameCard game={featuredNext} featured />}
              {upcoming
                .filter((g) => (playingToday ? true : g.slug !== featuredNext?.slug))
                .slice(0, 5)
                .map((g) => (
                  <GameCard key={g.slug} game={g} />
                ))}
            </div>
          </div>

          <aside className="beat-rail">
            {featuredWatch && <WatchOptions game={featuredWatch} />}
            <EmailCapture source="how-to-watch" variant="rail" />
            <div className="beat-widget">
              <h2>Desk links</h2>
              <div style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
                <Link href="/basketball" style={{ textDecoration: "none" }}>
                  Nebraska Basketball HQ →
                </Link>
                <Link href="/volleyball" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500 }}>
                  Volleyball schedule
                </Link>
                <Link href="/football" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500 }}>
                  Football schedule
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {upcoming.length > 5 && (
          <section style={{ marginTop: 16 }}>
            <div className="beat-widget">
              <h2>More upcoming</h2>
              <div className="beat-river" style={{ marginTop: 0 }}>
                {upcoming.slice(5).map((g) => (
                  <GameCard key={g.slug} game={g} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Disclaimer variant="short" />
      </div>
    </>
  );
}
