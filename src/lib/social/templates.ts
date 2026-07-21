import type { ScheduledGame, SeasonSchedule } from "@/lib/schedule/types";

// Broadcast-clean voice: no emoji spam, short lines, always a site link.
// Variant selection is deterministic per post key so reruns are idempotent.

const SITE = "nebrasketball.com";

export function pickVariant(key: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}

function opponentLine(game: ScheduledGame): string {
  if (game.homeAway === "away") return `Nebraska at ${game.opponent}`;
  if (game.homeAway === "neutral") return `Nebraska vs ${game.opponent}`;
  return `${game.opponent} at Nebraska`;
}

function whereToWatch(game: ScheduledGame): string {
  const parts: string[] = [];
  if (game.time) parts.push(game.time);
  if (game.tv) parts.push(`on ${game.tv}`);
  return parts.length > 0 ? parts.join(" ") : "Time and TV at the link";
}

export function gamedayPost(
  key: string,
  game: ScheduledGame,
  sportLabel: string,
  path: string
): string {
  const variants = [
    `GAMEDAY. ${opponentLine(game)}.\n\n${whereToWatch(game)} · ${game.venue}, ${game.city}\n\nSchedule, TV and live score: ${SITE}${path}\n\nGBR`,
    `It's gameday in Husker Nation.\n\n${opponentLine(game)}\n${whereToWatch(game)} · ${game.venue}\n\nHow to watch: ${SITE}${path}`,
    `Nebraska ${sportLabel.toLowerCase()} is back today.\n\n${opponentLine(game)} · ${whereToWatch(game)}\n\nEverything you need: ${SITE}${path}\n\nGBR`,
  ];
  return variants[pickVariant(key, variants.length)];
}

export function startingSoonPost(
  key: string,
  game: ScheduledGame,
  path: string
): string {
  const variants = [
    `Almost time. ${opponentLine(game)} ${game.time ? `· ${game.time}` : ""}${game.tv ? ` · ${game.tv}` : ""}\n\nLive score: ${SITE}${path}`,
    `${opponentLine(game)} — starting soon.${game.tv ? ` Watch on ${game.tv}.` : ""}\n\nFollow live: ${SITE}${path}\n\nGBR`,
  ];
  return variants[pickVariant(key, variants.length)];
}

export function finalScorePost(
  key: string,
  opponent: string,
  nebraskaScore: number,
  opponentScore: number,
  won: boolean,
  path: string
): string {
  const scoreline = `Nebraska ${nebraskaScore}, ${opponent} ${opponentScore}`;
  const winVariants = [
    `FINAL: ${scoreline}.\n\nHuskers win. GBR.\n\nSeason schedule and results: ${SITE}${path}`,
    `Huskers. Win.\n\nFINAL: ${scoreline}\n\n${SITE}${path}\n\nGBR`,
  ];
  const lossVariants = [
    `FINAL: ${scoreline}.\n\nOn to the next one.\n\nFull schedule: ${SITE}${path}`,
  ];
  const variants = won ? winVariants : lossVariants;
  return variants[pickVariant(key, variants.length)];
}

export function rankingsPost(
  key: string,
  pollTitle: string,
  rank: number,
  record: string,
  sportLabel: string,
  path: string
): string {
  const variants = [
    `New ${pollTitle}: Nebraska ${sportLabel.toLowerCase()} checks in at No. ${rank}${record ? ` (${record})` : ""}.\n\nFull rankings: ${SITE}${path}`,
    `Nebraska is No. ${rank} in the latest ${pollTitle}${record ? ` at ${record}` : ""}.\n\n${SITE}${path}\n\nGBR`,
  ];
  return variants[pickVariant(key, variants.length)];
}

export function weeklyPost(
  key: string,
  sportLabel: string,
  games: ScheduledGame[],
  path: string
): string {
  const lines = games
    .slice(0, 4)
    .map((g) => {
      const [, month, day] = g.date.split("-").map(Number);
      const dayLabel = new Date(2026, month - 1, day).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return `${dayLabel}: ${g.homeAway === "away" ? "at" : "vs"} ${g.opponent}${g.tv ? ` (${g.tv})` : ""}`;
    })
    .join("\n");
  return `This week in Nebraska ${sportLabel.toLowerCase()}:\n\n${lines}\n\nTimes, TV and live scores: ${SITE}${path}\n\nGBR`;
}

/** "2026-09-05" -> "Sept 5". Parsed as a plain date, never a UTC instant. */
export function formatDate(dateIso: string): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * A single evergreen post. Every field is derived from the schedule data in
 * the repo — nothing here is model-written, so an off-season post can never
 * invent an opponent, a time or a result.
 */
export interface ScheduleFact {
  /** Stable id so the dedup key is meaningful in the database. */
  id: string;
  text: string;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Opponent spotlight for the next game that has not been played yet.
 * Pure restatement of schedule fields — no scouting claims, no predictions.
 */
export function opponentSpotlightPost(
  key: string,
  game: ScheduledGame,
  gameNumber: number,
  totalGames: number,
  sportLabel: string,
  path: string
): string {
  const where =
    game.homeAway === "home"
      ? `${game.venue}, ${game.city}`
      : `${game.venue}, ${game.city}`;
  const watch = [game.time, game.tv ? `on ${game.tv}` : null]
    .filter(Boolean)
    .join(" ");
  const variants = [
    `Next up on the 2026 Nebraska ${sportLabel.toLowerCase()} slate — game ${gameNumber} of ${totalGames}:\n\n${opponentLine(game)}\n${formatDate(game.date)}${watch ? ` · ${watch}` : ""}\n${where}\n\n${SITE}${path}`,
    `Opponent watch: ${game.opponent}.\n\n${formatDate(game.date)} · ${opponentLine(game)}\n${where}${watch ? `\n${watch}` : ""}\n\nFull schedule: ${SITE}${path}\n\nGBR`,
  ];
  return variants[pickVariant(key, variants.length)];
}

/**
 * Computes evergreen talking points straight from a SeasonSchedule.
 * Only facts that are arithmetically true of the data are emitted, so a
 * schedule change automatically changes (or drops) the corresponding post.
 */
export function scheduleFacts(schedule: SeasonSchedule): ScheduleFact[] {
  const { games, sportLabel } = schedule;
  const sport = sportLabel.toLowerCase();
  const facts: ScheduleFact[] = [];
  if (games.length === 0) return facts;

  const home = games.filter((g) => g.homeAway === "home");
  const away = games.filter((g) => g.homeAway === "away");
  const neutral = games.filter((g) => g.homeAway === "neutral");

  facts.push({
    id: "venue-split",
    text: `The 2026 Nebraska ${sport} schedule: ${plural(home.length, "home date")}, ${away.length} on the road${neutral.length > 0 ? `, ${neutral.length} at neutral sites` : ""}.\n\n${games.length} games in all.`,
  });

  // Opening home stand — only claimed when it is actually a stand.
  let stand = 0;
  while (games[stand]?.homeAway === "home") stand++;
  if (stand >= 2) {
    facts.push({
      id: "home-stand",
      text: `Nebraska ${sport} opens 2026 with ${plural(stand, "straight home game")}.\n\nFirst road trip: ${formatDate(games[stand].date)} at ${games[stand].opponent}.`,
    });
  }

  // Bye weeks, inferred from real gaps rather than asserted.
  for (let i = 1; i < games.length; i++) {
    const prev = Date.parse(`${games[i - 1].date}T12:00:00Z`);
    const curr = Date.parse(`${games[i].date}T12:00:00Z`);
    const gap = Math.round((curr - prev) / 86400000);
    if (gap >= 13) {
      facts.push({
        id: `bye-${games[i].date}`,
        text: `Nebraska ${sport} has an open week after ${formatDate(games[i - 1].date)}.\n\nBack in action ${formatDate(games[i].date)}: ${opponentLine(games[i])}.`,
      });
    }
  }

  // Announced broadcasts — a genuinely useful, checkable stat.
  const televised = games.filter((g) => g.tv);
  if (televised.length > 0) {
    const networks = [...new Set(televised.map((g) => g.tv))].join(", ");
    facts.push({
      id: "tv-announced",
      text: `${plural(televised.length, `Nebraska ${sport} game`)} already ${televised.length === 1 ? "has" : "have"} a network attached for 2026: ${networks}.\n\nThe rest land in waves — we track every one.`,
    });
  }

  // Anything the schedule itself flagged as notable.
  for (const game of games) {
    if (!game.note) continue;
    const note = game.note.toLowerCase();
    const marquee =
      note.includes("rivalry") ||
      note.includes("heroes") ||
      note.includes("homecoming") ||
      note.includes("challenge") ||
      note.includes("showcase");
    if (!marquee) continue;
    facts.push({
      id: `marquee-${game.date}`,
      text: `Circle it: ${formatDate(game.date)}.\n\n${opponentLine(game)} · ${game.venue}, ${game.city}\n${game.note}`,
    });
  }

  return facts;
}

export function scheduleFactPost(
  key: string,
  fact: ScheduleFact,
  path: string
): string {
  return `${fact.text}\n\n${SITE}${path}\n\nGBR`;
}

export function countdownPost(
  key: string,
  days: number,
  sportLabel: string,
  game: ScheduledGame,
  path: string
): string {
  const dayWord = days === 1 ? "day" : "days";
  const variants = [
    `${days} ${dayWord} until Nebraska ${sportLabel.toLowerCase()} is back.\n\nOpener: ${opponentLine(game)} · ${game.venue}, ${game.city}\n\nFull schedule: ${SITE}${path}\n\nGBR`,
    `Counting down: ${days} ${dayWord} to Husker ${sportLabel.toLowerCase()}.\n\n${opponentLine(game)} opens the season at ${game.venue}.\n\n${SITE}${path}`,
  ];
  return variants[pickVariant(key, variants.length)];
}
