import { findNebraskaGame, getScoreboard } from "@/lib/ncaa/api";
import type { GameWithResult, SeasonSchedule } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Attaches live/final results to a curated schedule by cross-referencing the
 * NCAA scoreboard for each game date that has arrived. Past days revalidate
 * daily (final scores never change); today revalidates every 2 minutes so
 * in-progress scores stay fresh under ISR.
 */
export async function attachResults(
  schedule: SeasonSchedule
): Promise<GameWithResult[]> {
  const now = Date.now();
  return Promise.all(
    schedule.games.map(async (game): Promise<GameWithResult> => {
      const gameStart = new Date(`${game.date}T00:00:00-05:00`).getTime();
      if (gameStart > now) return { ...game, result: null };

      const isToday = now - gameStart < DAY_MS;
      const [year, month, day] = game.date.split("-").map(Number);
      const games = await getScoreboard(
        schedule.sport,
        { year, month, day },
        isToday ? 120 : 86400
      );
      const match = findNebraskaGame(games);
      if (!match || match.state === "pre") return { ...game, result: null };

      const nebraska =
        match.home.seo === "nebraska" ? match.home : match.away;
      const opponent = match.home.seo === "nebraska" ? match.away : match.home;

      return {
        ...game,
        result: {
          state: match.state,
          nebraskaScore: nebraska.score,
          opponentScore: opponent.score,
          won: match.state === "final" ? nebraska.winner : null,
          currentPeriod: match.currentPeriod,
          network: match.network,
        },
      };
    })
  );
}

export function nextGame(games: GameWithResult[]): GameWithResult | null {
  const now = Date.now();
  return (
    games.find(
      (g) =>
        !g.result && new Date(`${g.date}T23:59:59-05:00`).getTime() >= now
    ) ?? null
  );
}

export function record(games: GameWithResult[]): { wins: number; losses: number } {
  let wins = 0;
  let losses = 0;
  for (const g of games) {
    if (g.result?.state === "final") {
      if (g.result.won) wins++;
      else losses++;
    }
  }
  return { wins, losses };
}
