// Client for the free ncaa-api (https://github.com/henrygd/ncaa-api), which
// mirrors ncaa.com URL paths. Point NCAA_API_BASE at a self-hosted instance
// for production traffic — the public instance is limited to 5 req/s.
const API_BASE = process.env.NCAA_API_BASE || "https://ncaa-api.henrygd.me";

export type NcaaSport = "volleyball-women" | "football" | "basketball-men";

const SPORT_PATHS: Record<NcaaSport, { scoreboard: string; rankings: string }> = {
  "volleyball-women": {
    scoreboard: "scoreboard/volleyball-women/d1",
    rankings: "rankings/volleyball-women/d1",
  },
  football: {
    scoreboard: "scoreboard/football/fbs",
    rankings: "rankings/football/fbs",
  },
  "basketball-men": {
    scoreboard: "scoreboard/basketball-men/d1",
    rankings: "rankings/basketball-men/d1",
  },
};

interface RawTeam {
  score: string;
  winner: boolean;
  rank: string;
  names: { char6: string; short: string; seo: string; full: string };
}

interface RawGame {
  game: {
    gameID: string;
    away: RawTeam;
    home: RawTeam;
    network: string;
    startTime: string;
    startTimeEpoch: string;
    startDate: string;
    gameState: "pre" | "live" | "final" | string;
    currentPeriod: string;
    contestClock: string;
    finalMessage: string;
    url: string;
  };
}

export interface ScoreboardGame {
  gameId: string;
  state: "pre" | "live" | "final";
  startTime: string;
  startTimeEpoch: number;
  startDate: string;
  network: string | null;
  currentPeriod: string;
  contestClock: string;
  home: TeamScore;
  away: TeamScore;
}

export interface TeamScore {
  name: string;
  seo: string;
  abbrev: string;
  score: number | null;
  winner: boolean;
  rank: number | null;
}

export interface RankingRow {
  rank: number;
  team: string;
  record: string;
  previous: string;
}

export interface Rankings {
  sport: string;
  title: string;
  updated: string;
  rows: RankingRow[];
}

async function fetchJson<T>(path: string, revalidateSeconds: number): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function normalizeTeam(raw: RawTeam): TeamScore {
  const score = raw.score === "" ? null : Number(raw.score);
  const rank = raw.rank === "" ? null : Number(raw.rank);
  return {
    name: raw.names.short,
    seo: raw.names.seo,
    abbrev: raw.names.char6,
    score: Number.isNaN(score) ? null : score,
    winner: raw.winner,
    rank: Number.isNaN(rank) ? null : rank,
  };
}

function normalizeGame(raw: RawGame): ScoreboardGame {
  const state =
    raw.game.gameState === "live" || raw.game.gameState === "final"
      ? raw.game.gameState
      : "pre";
  return {
    gameId: raw.game.gameID,
    state,
    startTime: raw.game.startTime,
    startTimeEpoch: Number(raw.game.startTimeEpoch) || 0,
    startDate: raw.game.startDate,
    network: raw.game.network || null,
    currentPeriod: raw.game.currentPeriod,
    contestClock: raw.game.contestClock,
    home: normalizeTeam(raw.game.home),
    away: normalizeTeam(raw.game.away),
  };
}

/**
 * Scoreboard for a sport on a given date (all D1/FBS games that day).
 * Completed days never change, so callers pass a long revalidate for past
 * dates and a short one for today.
 */
export async function getScoreboard(
  sport: NcaaSport,
  date: { year: number; month: number; day: number },
  revalidateSeconds = 300
): Promise<ScoreboardGame[]> {
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  const data = await fetchJson<{ games: RawGame[] }>(
    `${SPORT_PATHS[sport].scoreboard}/${date.year}/${mm}/${dd}`,
    revalidateSeconds
  );
  if (!data?.games) return [];
  return data.games.map(normalizeGame);
}

/** Finds Nebraska's game in a day's scoreboard, if any. */
export function findNebraskaGame(games: ScoreboardGame[]): ScoreboardGame | null {
  return (
    games.find((g) => g.home.seo === "nebraska" || g.away.seo === "nebraska") ??
    null
  );
}

/** Current top-25 style rankings for a sport (AVCA / CFP / AP). */
export async function getRankings(
  sport: NcaaSport,
  revalidateSeconds = 21600
): Promise<Rankings | null> {
  const data = await fetchJson<{
    sport: string;
    title: string;
    updated: string;
    data: Array<Record<string, string>>;
  }>(SPORT_PATHS[sport].rankings, revalidateSeconds);
  if (!data?.data) return null;
  return {
    sport: data.sport,
    title: data.title,
    updated: data.updated,
    rows: data.data.map((row) => ({
      rank: Number(row["RANK"]) || 0,
      team: row["TEAM"] ?? row["SCHOOL"] ?? "",
      record: row["RECORD"] ?? "",
      previous: row["PREVIOUS"] ?? "",
    })),
  };
}
