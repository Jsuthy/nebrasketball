import Link from "next/link";
import { getRankings, type NcaaSport } from "@/lib/ncaa/api";
import { attachResults, nextGame, record } from "@/lib/schedule/results";
import { scheduleJsonLd, faqJsonLd } from "@/lib/schedule/jsonld";
import type { SeasonSchedule } from "@/lib/schedule/types";
import ScheduleTable from "./ScheduleTable";
import NextGameCard from "./NextGameCard";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";
import RelatedLinks, { relatedBreadcrumbJsonLd } from "@/components/ui/RelatedLinks";
import { HeroBackdrop, PhotoCredit } from "@/components/media/PhotoHero";
import type { SitePhoto } from "@/lib/media/photos";

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 16px",
};

async function RankingsWidget({
  sport,
  rankingsNote,
}: {
  sport: NcaaSport;
  rankingsNote: string;
}) {
  const rankings = await getRankings(sport);
  if (!rankings || rankings.rows.length === 0) return null;
  const top10 = rankings.rows.slice(0, 10);
  const nebraskaRow = rankings.rows.find((r) =>
    r.team.toLowerCase().startsWith("nebraska")
  );
  const shown =
    nebraskaRow && !top10.includes(nebraskaRow)
      ? [...top10, nebraskaRow]
      : top10;
  return (
    <section className="reveal" style={{ marginTop: 64 }}>
      <h2 style={sectionTitle}>{rankings.title}</h2>
      <p style={{ color: "var(--faint)", fontSize: 13, margin: "0 0 14px" }}>
        {rankings.updated} · {rankingsNote}
      </p>
      <div
        style={{
          background: "var(--s1)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {shown.map((row) => {
          const isNebraska = row.team.toLowerCase().startsWith("nebraska");
          return (
            <div
              key={row.rank}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 18px",
                borderTop: row === shown[0] ? "none" : "1px solid var(--border)",
                background: isNebraska ? "rgba(208,0,0,0.14)" : "transparent",
                fontWeight: isNebraska ? 700 : 400,
                fontSize: 14,
              }}
            >
              <span style={{ display: "flex", alignItems: "baseline" }}>
                <span
                  className="font-data"
                  style={{
                    display: "inline-block",
                    width: 34,
                    color: isNebraska ? "var(--accent)" : "var(--faint)",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {row.rank}
                </span>
                <span style={{ color: isNebraska ? "var(--cream)" : "var(--text)" }}>
                  {row.team}
                </span>
              </span>
              <span className="font-data" style={{ color: "var(--muted)", fontSize: 13 }}>
                {row.record}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function SchedulePageContent({
  schedule,
  pagePath,
  heroKicker,
  heroTitle,
  intro,
  howToWatch,
  rankingsNote,
  gearSlug,
  extraSection,
  heroPhoto,
}: {
  schedule: SeasonSchedule;
  pagePath: string;
  heroKicker: string;
  heroTitle: string;
  intro: string;
  howToWatch: Array<{ label: string; body: string }>;
  rankingsNote: string;
  gearSlug: string;
  extraSection?: React.ReactNode;
  heroPhoto?: SitePhoto;
}) {
  const games = await attachResults(schedule);
  const upNext = nextGame(games);
  const seasonRecord = record(games);

  // FAQPage schema drawn from the season props / how-to-watch guidance. Generic
  // and accurate — no invented times or channels — so the Q&A can qualify for
  // FAQ rich results without duplicating the per-game pages.
  const watchGuidance =
    howToWatch[0]?.body ??
    `Nebraska ${schedule.sportLabel} games air across national and Big Ten networks, with live-TV streamers carrying the channels for cord-cutters.`;
  const scheduleFaqs = [
    {
      q: `Where can I watch Nebraska ${schedule.sportLabel} in ${schedule.seasonLabel}?`,
      a: watchGuidance,
    },
    {
      q: `What TV channels carry Nebraska ${schedule.sportLabel}?`,
      a: `Nebraska ${schedule.sportLabel} games air on Big Ten Network (BTN) and national networks such as FOX, FS1, CBS, NBC/Peacock, and ESPN, depending on the matchup. Each game's network is listed on the schedule above and updates automatically as broadcast assignments are announced.`,
    },
    {
      q: "How do I find out what time Nebraska plays?",
      a: `Start times appear in the full ${schedule.seasonLabel} schedule above and update automatically once the Big Ten confirms them — many are set only 6–12 days before the game. For a single game, open its "how to watch" page for the confirmed time, TV channel, and streaming options.`,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "56px 20px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(scheduleJsonLd(schedule, pagePath)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(relatedBreadcrumbJsonLd(pagePath, heroTitle)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(scheduleFaqs)),
        }}
      />

      {/* Ghost season numeral behind the hero */}
      <div className="ghost-num" style={{ top: -30, right: -20, fontSize: "clamp(160px, 28vw, 320px)" }} aria-hidden>
        {schedule.seasonLabel}
      </div>

      <header
        style={{
          marginBottom: 40,
          position: "relative",
          zIndex: 1,
          ...(heroPhoto
            ? { padding: "28px 28px 24px", borderRadius: 8, overflow: "hidden" }
            : {}),
        }}
      >
        {heroPhoto && <HeroBackdrop photo={heroPhoto} />}
        <div style={{ position: "relative", zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>{heroKicker}</div>
        <h1
          className="stat-hero"
          style={{
            fontSize: "clamp(46px, 8vw, 84px)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {heroTitle}
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: 640,
            marginTop: 18,
          }}
        >
          {intro}
        </p>
        {heroPhoto && (
          <div style={{ marginTop: 14 }}>
            <PhotoCredit photo={heroPhoto} />
          </div>
        )}
        </div>
      </header>

      {upNext && (
        <div className="reveal" style={{ marginBottom: 44, position: "relative", zIndex: 1 }}>
          <NextGameCard game={upNext} record={seasonRecord} sportLabel={schedule.sportLabel} />
        </div>
      )}

      <section className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>Full {schedule.seasonLabel} Schedule</h2>
        <ScheduleTable games={games} />
        <p style={{ color: "var(--faint)", fontSize: 12, marginTop: 12 }}>
          Home games shaded. Times, TV, and scores update automatically all season.
        </p>
      </section>

      <section className="reveal" style={{ marginTop: 64 }}>
        <h2 style={sectionTitle}>
          How to Watch Nebraska {schedule.sportLabel} in {schedule.seasonLabel}
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {howToWatch.map((item) => (
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

      <RankingsWidget sport={schedule.sport} rankingsNote={rankingsNote} />

      {extraSection}

      <section className="reveal" style={{ marginTop: 64 }}>
        <h2 style={sectionTitle}>Never Miss a Match</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 16px" }}>
          Get schedule changes, TV announcements, and score recaps in your inbox.
        </p>
        <EmailCapture />
        <p style={{ marginTop: 22, fontSize: 14 }}>
          <Link href={`/gear/${gearSlug}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
            Shop Nebraska {schedule.sportLabel} gear →
          </Link>
        </p>
      </section>

      <RelatedLinks currentPath={pagePath} />

      <div style={{ marginTop: 48 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
