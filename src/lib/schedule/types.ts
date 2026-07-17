import type { NcaaSport } from "@/lib/ncaa/api";

export interface ScheduledGame {
  /** ISO date, e.g. "2026-08-22" (local Lincoln date) */
  date: string;
  /** Announced local start time, e.g. "7:00 PM CT", or null if TBA */
  time: string | null;
  opponent: string;
  homeAway: "home" | "away" | "neutral";
  venue: string;
  city: string;
  /** Announced broadcast (FOX, NBC, BTN, B1G+, ESPN...), null if TBA */
  tv: string | null;
  note: string | null;
}

export interface SeasonSchedule {
  sport: NcaaSport;
  sportLabel: string;
  seasonLabel: string;
  games: ScheduledGame[];
}

/** A scheduled game with any live/final result attached from the scores API. */
export interface GameWithResult extends ScheduledGame {
  result: {
    state: "live" | "final";
    nebraskaScore: number | null;
    opponentScore: number | null;
    won: boolean | null;
    currentPeriod: string;
    network: string | null;
  } | null;
}
