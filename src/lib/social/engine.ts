import { createClient } from "@supabase/supabase-js";
import { getRankings, getScoreboard, findNebraskaGame } from "@/lib/ncaa/api";
import { VOLLEYBALL_2026, FOOTBALL_2026 } from "@/lib/schedule/data";
import type { ScheduledGame, SeasonSchedule } from "@/lib/schedule/types";
import { postTweet, xCredentialsPresent } from "./x-client";
import {
  countdownPost,
  finalScorePost,
  gamedayPost,
  opponentSpotlightPost,
  rankingsPost,
  scheduleFactPost,
  scheduleFacts,
  startingSoonPost,
  weeklyPost,
} from "./templates";

const MAX_POSTS_PER_RUN = 4;

/**
 * Countdown cadence: every 10 days out past a month, every 5 days inside a
 * month, then daily for the final two weeks as the season ramps.
 */
function isCountdownDay(days: number): boolean {
  if (days <= 0) return false;
  if (days <= 14) return true;
  if (days <= 30) return days % 5 === 0;
  if (days <= 100) return days % 10 === 0;
  return false;
}

const SPORTS: Array<{ schedule: SeasonSchedule; path: string }> = [
  { schedule: VOLLEYBALL_2026, path: "/volleyball" },
  { schedule: FOOTBALL_2026, path: "/football" },
];

interface Candidate {
  key: string;
  text: string;
}

export interface CentralTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  weekday: string;
  iso: string; // YYYY-MM-DD
  epochMs: number;
}

function centralNow(): CentralTime {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  return {
    year,
    month,
    day,
    hour: Number(get("hour")),
    weekday: get("weekday"),
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    epochMs: now.getTime(),
  };
}

function gameStartEpochMs(game: ScheduledGame): number | null {
  if (!game.time) return null;
  const match = game.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  // Central time; CDT offset. Worst case an hour off after DST ends in Nov,
  // which the wide "starting soon" window absorbs.
  return new Date(
    `${game.date}T${String(hours).padStart(2, "0")}:${match[2]}:00-05:00`
  ).getTime();
}

/** Whole days since the epoch — a stable per-day counter for rotations. */
function dayIndex(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

function daysUntil(dateIso: string, todayIso: string): number {
  const [y1, m1, d1] = todayIso.split("-").map(Number);
  const [y2, m2, d2] = dateIso.split("-").map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / 86400000);
}

export async function buildCandidates(ct: CentralTime): Promise<Candidate[]> {
  const candidates: Candidate[] = [];

  for (const { schedule, path } of SPORTS) {
    const { sport, sportLabel, games } = schedule;
    const opener = games[0];
    const todayGame = games.find((g) => g.date === ct.iso) ?? null;

    // Season countdown (morning window)
    if (ct.hour >= 9 && ct.hour <= 12 && opener) {
      const days = daysUntil(opener.date, ct.iso);
      if (isCountdownDay(days)) {
        const key = `countdown:${sport}:${days}`;
        candidates.push({
          key,
          text: countdownPost(key, days, sportLabel, opener, path),
        });
      }
    }

    // Monday look-ahead (only when there are games this week)
    if (ct.weekday === "Mon" && ct.hour >= 9 && ct.hour <= 12) {
      const thisWeek = games.filter((g) => {
        const d = daysUntil(g.date, ct.iso);
        return d >= 0 && d <= 6;
      });
      if (thisWeek.length > 0) {
        const key = `week:${sport}:${ct.iso}`;
        candidates.push({
          key,
          text: weeklyPost(key, sportLabel, thisWeek, path),
        });
      }
    }

    // Gameday morning
    if (todayGame && ct.hour >= 8 && ct.hour <= 11) {
      const key = `gameday:${sport}:${ct.iso}`;
      candidates.push({
        key,
        text: gamedayPost(key, todayGame, sportLabel, path),
      });
    }

    // Starting soon (15–100 minutes before tip/serve/kick)
    if (todayGame) {
      const start = gameStartEpochMs(todayGame);
      if (start) {
        const minutesOut = (start - ct.epochMs) / 60000;
        if (minutesOut >= 15 && minutesOut <= 100) {
          const key = `soon:${sport}:${ct.iso}`;
          candidates.push({
            key,
            text: startingSoonPost(key, todayGame, path),
          });
        }
      }
    }

    // Final score — check today and yesterday (late games cross midnight)
    for (const offset of [0, 1]) {
      const target = new Date(ct.epochMs - offset * 86400000);
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).formatToParts(target);
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
      const dateIso = `${get("year")}-${String(get("month")).padStart(2, "0")}-${String(get("day")).padStart(2, "0")}`;
      const scheduled = games.find((g) => g.date === dateIso);
      if (!scheduled) continue;

      const board = await getScoreboard(
        sport,
        { year: get("year"), month: get("month"), day: get("day") },
        120
      );
      const match = findNebraskaGame(board);
      if (!match || match.state !== "final") continue;

      const nebraska = match.home.seo === "nebraska" ? match.home : match.away;
      const opponent = match.home.seo === "nebraska" ? match.away : match.home;
      if (nebraska.score === null || opponent.score === null) continue;

      const key = `final:${sport}:${dateIso}`;
      candidates.push({
        key,
        text: finalScorePost(
          key,
          opponent.name,
          nebraska.score,
          opponent.score,
          nebraska.winner,
          path
        ),
      });
    }

    // Poll movement — only current-season polls (skip stale off-season data)
    if (ct.hour >= 9 && ct.hour <= 20) {
      const rankings = await getRankings(sport, 3600);
      const nebraskaRow = rankings?.rows.find((r) =>
        r.team.toLowerCase().startsWith("nebraska")
      );
      const isCurrent =
        rankings?.updated.includes(String(ct.year)) ||
        (ct.month === 1 && rankings?.updated.includes(String(ct.year - 1)));
      if (rankings && nebraskaRow && isCurrent) {
        const updatedKey = rankings.updated.replace(/\W+/g, "-").toLowerCase();
        const key = `rankings:${sport}:${updatedKey}`;
        candidates.push({
          key,
          text: rankingsPost(
            key,
            rankings.title,
            nebraskaRow.rank,
            nebraskaRow.record,
            sportLabel,
            path
          ),
        });
      }
    }
  }

  // Evergreen rotation — fills off-season dead air. Deliberately last and
  // deliberately conditional: it only speaks on days that produced no
  // game-driven news, so it can never crowd out a real result or gameday.
  // One post per day, alternating sports; content is computed from the
  // schedule, never model-written, so it cannot invent a fact.
  if (candidates.length === 0 && ct.hour >= 15 && ct.hour <= 18) {
    const dayIdx = dayIndex(ct.iso);
    const { schedule, path } = SPORTS[dayIdx % SPORTS.length];
    const pool: Candidate[] = [];

    const nextIdx = schedule.games.findIndex(
      (g) => daysUntil(g.date, ct.iso) > 0
    );
    if (nextIdx !== -1) {
      const game = schedule.games[nextIdx];
      const key = `spotlight:${schedule.sport}:${game.date}`;
      pool.push({
        key,
        text: opponentSpotlightPost(
          key,
          game,
          nextIdx + 1,
          schedule.games.length,
          schedule.sportLabel,
          path
        ),
      });
    }
    for (const fact of scheduleFacts(schedule)) {
      const key = `fact:${schedule.sport}:${fact.id}`;
      pool.push({ key, text: scheduleFactPost(key, fact, path) });
    }

    if (pool.length > 0) {
      // Advances one slot per day for this sport. Content-based keys mean an
      // exhausted pool goes quiet rather than repeating itself.
      const slot = Math.floor(dayIdx / SPORTS.length) % pool.length;
      candidates.push(pool[slot]);
    }
  }

  return candidates;
}

export interface EngineResult {
  dryRun: boolean;
  considered: number;
  posted: Array<{ key: string; tweetId?: string; text: string }>;
  skipped: string[];
  errors: Array<{ key: string; error: string }>;
}

export async function runSocialEngine(): Promise<EngineResult> {
  const ct = centralNow();
  const candidates = await buildCandidates(ct);
  const result: EngineResult = {
    dryRun: !xCredentialsPresent(),
    considered: candidates.length,
    posted: [],
    skipped: [],
    errors: [],
  };
  if (candidates.length === 0) return result;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing, error: readError } = await supabase
    .from("social_posts")
    .select("key")
    .in(
      "key",
      candidates.map((c) => c.key)
    );
  if (readError) {
    result.errors.push({
      key: "social_posts-table",
      error: `Supabase read failed (run the setup SQL?): ${readError.message}`,
    });
    return result;
  }

  const seen = new Set((existing ?? []).map((row) => row.key));
  const fresh = candidates.filter((c) => !seen.has(c.key));
  result.skipped = candidates.filter((c) => seen.has(c.key)).map((c) => c.key);

  for (const candidate of fresh.slice(0, MAX_POSTS_PER_RUN)) {
    if (result.dryRun) {
      // Preview only — nothing recorded, so posts go out once creds exist.
      result.posted.push({ key: candidate.key, text: candidate.text });
      continue;
    }
    try {
      const tweetId = await postTweet(candidate.text);
      await supabase.from("social_posts").insert({
        key: candidate.key,
        body: candidate.text,
        tweet_id: tweetId,
      });
      result.posted.push({ key: candidate.key, tweetId, text: candidate.text });
    } catch (err) {
      result.errors.push({
        key: candidate.key,
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return result;
}
