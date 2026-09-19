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

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="beat-scoreline">
      <span className="beat-sec" style={{ letterSpacing: "0.06em" }}>
        {label}
      </span>
      <span style={{ fontWeight: 700, textAlign: "right" }}>{value}</span>
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

      <div className="beat-wrap" style={{ paddingTop: 8 }}>
        <div className="beat-stack">
          <div>
            <article className="beat-lead">
              <div className="beat-pad">
                <div className="beat-sec">
                  How to watch · Nebraska {game.sportLabel} {game.seasonLabel}
                </div>
                <h1>How to watch Nebraska vs {game.opponent}</h1>
                <p>
                  {matchupTitle(game)} · {formatLongDate(game.date)}
                  {game.time ? ` · ${game.time}` : ""}. {venueLine(game)}{" "}
                  {game.tv
                    ? `The game airs on ${game.tv}.`
                    : "The TV channel hasn't been announced yet — it updates here automatically."}
                </p>
              </div>
            </article>

            <div className="beat-widget" style={{ marginTop: 12 }}>
              <h2>Game card</h2>
              <FactRow label="Matchup" value={matchupTitle(game)} />
              <FactRow label="Date" value={formatLongDate(game.date)} />
              <FactRow label="Time (CT)" value={game.time ?? "TBA"} />
              <FactRow label="TV / Stream" value={game.tv ?? "TBA"} />
              <FactRow label="Site" value={homeAwayLabel(game)} />
              <FactRow label="Venue" value={`${game.venue} — ${game.city}`} />
              {game.note && <FactRow label="Note" value={game.note} />}
            </div>

            <div className="beat-river">
              {sections.map((item) => (
                <article key={item.label} className="beat-story" style={{ gridTemplateColumns: "1fr" }}>
                  <div>
                    <div className="beat-sec">{item.label}</div>
                    <h3>{item.label}</h3>
                    <span>{item.body}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="beat-rail">
            <WatchOptions game={game} />
            <div className="beat-widget">
              <h2>FAQ</h2>
              {faqs.map((f) => (
                <div key={f.q} style={{ padding: "8px 0", borderBottom: "1px solid var(--rule-soft)" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{f.q}</div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, marginTop: 16, fontWeight: 700 }}>
          <Link href={`/${game.sportSlug}`} style={{ color: "var(--scarlet)" }}>
            ← Full Nebraska {game.sportLabel} {game.seasonLabel} schedule
          </Link>
          <Link href="/how-to-watch" style={{ color: "var(--scarlet)" }}>
            Does Nebraska play today? →
          </Link>
        </div>
      </div>
    </>
  );
}
