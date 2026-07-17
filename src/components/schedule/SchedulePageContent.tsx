import Link from "next/link";
import { getRankings, type NcaaSport } from "@/lib/ncaa/api";
import { attachResults, nextGame, record } from "@/lib/schedule/results";
import { scheduleJsonLd } from "@/lib/schedule/jsonld";
import type { SeasonSchedule } from "@/lib/schedule/types";
import ScheduleTable from "./ScheduleTable";
import NextGameCard from "./NextGameCard";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: 17,
  fontWeight: 800,
  margin: "0 0 14px",
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
    <section style={{ marginTop: 48 }}>
      <h2 style={sectionTitle}>{rankings.title}</h2>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
        {rankings.updated} · {rankingsNote}
      </p>
      <div style={{ border: "1px solid var(--border)", borderRadius: 4 }}>
        {shown.map((row) => {
          const isNebraska = row.team.toLowerCase().startsWith("nebraska");
          return (
            <div
              key={row.rank}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 16px",
                borderTop: row === shown[0] ? "none" : "1px solid var(--border)",
                background: isNebraska ? "rgba(208,0,0,0.12)" : "transparent",
                fontWeight: isNebraska ? 700 : 400,
                fontSize: 14,
              }}
            >
              <span>
                <span
                  style={{
                    display: "inline-block",
                    width: 28,
                    color: isNebraska ? "var(--red)" : "var(--muted)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                  }}
                >
                  {row.rank}
                </span>
                {row.team}
              </span>
              <span style={{ color: "var(--muted)" }}>{row.record}</span>
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
}) {
  const games = await attachResults(schedule);
  const upNext = nextGame(games);
  const seasonRecord = record(games);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 60px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(scheduleJsonLd(schedule, pagePath)),
        }}
      />

      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--red)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {heroKicker}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {heroTitle}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 640, marginTop: 12 }}>
          {intro}
        </p>
      </header>

      {upNext && (
        <div style={{ marginBottom: 32 }}>
          <NextGameCard game={upNext} record={seasonRecord} sportLabel={schedule.sportLabel} />
        </div>
      )}

      <section>
        <h2 style={sectionTitle}>
          Full {schedule.seasonLabel} Schedule
        </h2>
        <ScheduleTable games={games} />
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
          Home games shaded. Times and TV update automatically as the Big Ten
          announces broadcast assignments; scores update automatically on game day.
        </p>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>How to Watch Nebraska {schedule.sportLabel} in {schedule.seasonLabel}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {howToWatch.map((item) => (
            <div
              key={item.label}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 4,
                background: "var(--s1)",
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <RankingsWidget sport={schedule.sport} rankingsNote={rankingsNote} />

      {extraSection}

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>Never Miss a Match</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px" }}>
          Get schedule changes, TV announcements, and score recaps in your inbox.
        </p>
        <EmailCapture />
        <p style={{ marginTop: 20, fontSize: 14 }}>
          <Link href={`/gear/${gearSlug}`} style={{ color: "var(--red)", fontWeight: 600 }}>
            Shop Nebraska {schedule.sportLabel} gear →
          </Link>
        </p>
      </section>

      <div style={{ marginTop: 40 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
