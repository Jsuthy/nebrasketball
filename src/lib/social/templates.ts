import type { ScheduledGame } from "@/lib/schedule/types";

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
