import type { NcaaSport } from "@/lib/ncaa/api";
import { slugify } from "@/lib/utils";
import { VOLLEYBALL_2026, FOOTBALL_2026, BASKETBALL_2026 } from "./data";
import type { ScheduledGame, SeasonSchedule } from "./types";

/**
 * A single game flattened across every season schedule, carrying its sport
 * context plus a stable, keyword-rich URL slug for the /how-to-watch pages.
 */
export interface GameEntry extends ScheduledGame {
  /** e.g. "nebraska-vs-wisconsin-volleyball-oct-10-2026" */
  slug: string;
  sport: NcaaSport;
  /** Display label, e.g. "Volleyball" */
  sportLabel: string;
  /** Route segment for the sport's season page, e.g. "volleyball" */
  sportSlug: string;
  seasonLabel: string;
}

// Every SeasonSchedule the site currently ships. Adding a schedule here makes
// its games flow automatically into slugs, the hub, per-game pages, and the
// sitemap — no other changes required. sportSlugFor lowercases sportLabel, so
// "Basketball" resolves to /basketball and slugs read
// nebraska-vs-creighton-basketball-dec-5-2026.
const SCHEDULES: SeasonSchedule[] = [
  VOLLEYBALL_2026,
  FOOTBALL_2026,
  BASKETBALL_2026,
];

const MONTH_ABBR = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/** Route segment for a sport's season schedule page (e.g. "volleyball"). */
function sportSlugFor(schedule: SeasonSchedule): string {
  return schedule.sportLabel.toLowerCase();
}

function makeSlug(game: ScheduledGame, sportSlug: string): string {
  const [year, month, day] = game.date.split("-").map(Number);
  const opponent = slugify(game.opponent);
  return `nebraska-vs-${opponent}-${sportSlug}-${MONTH_ABBR[month - 1]}-${day}-${year}`;
}

/** All games across every season schedule, flattened and sorted by date. */
export function getAllGames(): GameEntry[] {
  const entries: GameEntry[] = [];
  for (const schedule of SCHEDULES) {
    const sportSlug = sportSlugFor(schedule);
    for (const game of schedule.games) {
      entries.push({
        ...game,
        slug: makeSlug(game, sportSlug),
        sport: schedule.sport,
        sportLabel: schedule.sportLabel,
        sportSlug,
        seasonLabel: schedule.seasonLabel,
      });
    }
  }
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function getGameBySlug(slug: string): GameEntry | null {
  return getAllGames().find((g) => g.slug === slug) ?? null;
}

/** Today's local date in Lincoln (America/Chicago) as an ISO "YYYY-MM-DD". */
export function todayCT(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Games whose local Lincoln date is today. */
export function getTodaysGames(): GameEntry[] {
  const today = todayCT();
  return getAllGames().filter((g) => g.date === today);
}

/** The soonest game today or in the future across all sports, or null. */
export function getNextGame(): GameEntry | null {
  const today = todayCT();
  return getAllGames().find((g) => g.date >= today) ?? null;
}

// --- Display helpers (dates parsed as local calendar dates, no TZ shift) ---

/** e.g. "Saturday, October 10, 2026" */
export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** e.g. "Oct 10, 2026" */
export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Matchup headline, e.g. "Ohio State at Nebraska" / "Nebraska at Iowa". */
export function matchupTitle(game: GameEntry): string {
  if (game.homeAway === "away") return `Nebraska at ${game.opponent}`;
  if (game.homeAway === "neutral") return `Nebraska vs ${game.opponent}`;
  return `${game.opponent} at Nebraska`;
}

/** One-line venue phrasing for the direct answer. */
export function venueLine(game: GameEntry): string {
  if (game.homeAway === "home") {
    return `Nebraska hosts ${game.opponent} at ${game.venue} in ${game.city}.`;
  }
  if (game.homeAway === "away") {
    return `Nebraska travels to face ${game.opponent} at ${game.venue} in ${game.city}.`;
  }
  return `Nebraska meets ${game.opponent} at a neutral site, ${game.venue} in ${game.city}.`;
}

export interface WatchSection {
  label: string;
  body: string;
}

/**
 * How-to-watch guidance derived from the announced broadcast (game.tv). Covers
 * the network plus the live-TV streamers that carry it. When TV is unannounced,
 * returns sport-appropriate expectations.
 */
export function watchSections(game: GameEntry): WatchSection[] {
  const tv = game.tv;
  const sections: WatchSection[] = [];

  if (!tv) {
    sections.push({
      label: "TV channel: to be announced",
      body:
        game.sportLabel === "Football"
          ? "The network for this game hasn't been assigned yet. Big Ten football games land on FOX, CBS, NBC, or BTN — often revealed 6–12 days out. Nebraska's TV channels update automatically on this page as soon as each assignment is announced."
          : "The broadcast for this match hasn't been assigned yet. Most Nebraska volleyball matches air on Big Ten Network (BTN) or stream on B1G+. This page updates automatically the moment the TV home is set.",
    });
    sections.push({
      label: "How to stream when it's set",
      body:
        "For BTN, FOX, FS1, CBS, or NBC games, live-TV streamers Fubo, YouTube TV, and Hulu + Live TV carry the channels — no cable required. B1G+ matches stream on the Big Ten's own subscription service.",
    });
    return sections;
  }

  const upper = tv.toUpperCase();

  if (upper.includes("BTN") || upper.includes("BIG TEN NETWORK")) {
    sections.push({
      label: "Watch on Big Ten Network (BTN)",
      body: "This game airs on Big Ten Network, carried on most cable and satellite packages. Cord-cutters can stream BTN live on Fubo, YouTube TV, and Hulu + Live TV, or on the Fox Sports app / BTN app with a TV-provider login.",
    });
  } else if (upper.includes("B1G+") || upper.includes("BIG TEN PLUS")) {
    sections.push({
      label: "Stream on B1G+",
      body: "This match streams exclusively on B1G+, the Big Ten's subscription streaming service. It is not on regular TV — you'll need a B1G+ subscription to watch live.",
    });
  } else if (upper.includes("NBC")) {
    sections.push({
      label: "Watch on NBC (and Peacock)",
      body: "This game is on NBC and also streams live on Peacock. NBC is available over the air and on Fubo, YouTube TV, and Hulu + Live TV. Peacock offers a standalone subscription if you'd rather stream.",
    });
  } else if (upper.includes("CBS")) {
    sections.push({
      label: "Watch on CBS (and Paramount+)",
      body: "This game airs on CBS and streams live on Paramount+ (with the Showtime/live-TV tier). CBS is available over the air and on Fubo, YouTube TV, and Hulu + Live TV.",
    });
  } else if (upper.includes("ESPN")) {
    sections.push({
      label: "Watch on ESPN",
      body: "This game is on ESPN. Stream it live with the ESPN app (TV-provider login), or on Fubo, YouTube TV, and Hulu + Live TV, which all carry the ESPN networks.",
    });
  } else if (upper.includes("FS1") || upper.includes("FOX")) {
    sections.push({
      label: `Watch on ${tv}`,
      body: `This game airs on ${tv}. Both FOX and FS1 are carried on Fubo, YouTube TV, Hulu + Live TV, and Sling, and stream on the Fox Sports app with a TV-provider login. FOX is also available over the air.`,
    });
  } else {
    sections.push({
      label: `Watch on ${tv}`,
      body: `This game airs on ${tv}. Most national broadcasters are carried by live-TV streamers Fubo, YouTube TV, and Hulu + Live TV if you don't have cable.`,
    });
  }

  sections.push({
    label: "Listen / follow live",
    body:
      game.sportLabel === "Volleyball"
        ? "The Husker Radio Network carries every match statewide, and live scores appear on the Nebraska volleyball schedule page on match days."
        : "The Husker Sports Network carries every game on the radio, and live scores appear on the Nebraska schedule pages on game days.",
  });

  return sections;
}
