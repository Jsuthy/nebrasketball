import type { Metadata } from "next";
import Link from "next/link";
import LiveScores from "@/components/scores/LiveScores";
import Disclaimer from "@/components/ui/Disclaimer";
import { getScoreboard, type NcaaSport } from "@/lib/ncaa/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nebraska Live Scores — Husker Volleyball, Football & Basketball Today",
  description:
    "Live Nebraska Cornhuskers scores today, updated every minute — Husker volleyball, football, and basketball, plus top-25 games around the country.",
  alternates: { canonical: "/scores" },
};

const SPORTS: Array<{ sport: NcaaSport; label: string }> = [
  { sport: "volleyball-women", label: "Volleyball" },
  { sport: "football", label: "Football" },
  { sport: "basketball-men", label: "Basketball" },
];

function centralToday(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export default async function ScoresPage() {
  const today = centralToday();
  const boards = await Promise.all(
    SPORTS.map(async ({ sport, label }) => ({
      sport,
      label,
      games: (await getScoreboard(sport, today, 60)).slice(0, 12),
    }))
  );
  const initial = { sports: boards.filter((b) => b.games.length > 0) };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 60px" }}>
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
          Live · Refreshes Every Minute
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
          Husker Scoreboard
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 10 }}>
          Today&apos;s Nebraska games plus ranked matchups in volleyball,
          football, and basketball.{" "}
          <Link href="/volleyball" style={{ color: "var(--red)" }}>
            Volleyball schedule
          </Link>{" "}
          ·{" "}
          <Link href="/football" style={{ color: "var(--red)" }}>
            Football schedule
          </Link>
        </p>
      </header>

      <LiveScores initial={initial} />

      <div style={{ marginTop: 40 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
