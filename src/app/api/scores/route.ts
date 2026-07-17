import { NextResponse } from "next/server";
import { getScoreboard, type NcaaSport, type ScoreboardGame } from "@/lib/ncaa/api";

export const revalidate = 0;

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

/** Nebraska first, then ranked matchups, capped to keep the payload small. */
function prioritize(games: ScoreboardGame[]): ScoreboardGame[] {
  const nebraska = games.filter(
    (g) => g.home.seo === "nebraska" || g.away.seo === "nebraska"
  );
  const ranked = games
    .filter(
      (g) =>
        !nebraska.includes(g) && (g.home.rank !== null || g.away.rank !== null)
    )
    .sort((a, b) => a.startTimeEpoch - b.startTimeEpoch);
  return [...nebraska, ...ranked].slice(0, 12);
}

export async function GET() {
  const today = centralToday();
  const boards = await Promise.all(
    SPORTS.map(async ({ sport, label }) => ({
      sport,
      label,
      games: prioritize(await getScoreboard(sport, today, 60)),
    }))
  );

  return NextResponse.json(
    { date: today, sports: boards.filter((b) => b.games.length > 0) },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30" } }
  );
}
