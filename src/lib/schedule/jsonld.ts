import { SITE_URL } from "@/lib/constants";
import type { ScheduledGame, SeasonSchedule } from "./types";

function eventStartIso(game: ScheduledGame): string {
  // Announced times are Central; fall back to date-only when TBA.
  if (!game.time) return game.date;
  const match = game.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return game.date;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return `${game.date}T${String(hours).padStart(2, "0")}:${match[2]}:00-05:00`;
}

function postalAddress(city: string) {
  // City strings are "Lincoln, NE" style.
  const [locality, region] = city.split(",").map((s) => s.trim());
  return {
    "@type": "PostalAddress",
    addressLocality: locality,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: "US",
  };
}

/**
 * Schema.org markup for a season: SportsEvent nodes (physical location with
 * PostalAddress, per Google's event rich-result requirements) plus separate
 * BroadcastEvent nodes pointing at their game via broadcastOfEvent — TV info
 * is modeled on the broadcast, not the game.
 */
export function scheduleJsonLd(schedule: SeasonSchedule, pagePath: string) {
  const pageUrl = `${SITE_URL}${pagePath}`;
  const events = schedule.games.map((game, i) => {
    const id = `${pageUrl}#game-${i + 1}`;
    const nebraska = {
      "@type": "SportsTeam",
      name: `Nebraska ${schedule.sportLabel}`,
    };
    const opponent = { "@type": "SportsTeam", name: game.opponent };
    return {
      id,
      game,
      node: {
        "@type": "SportsEvent",
        "@id": id,
        name:
          game.homeAway === "away"
            ? `Nebraska at ${game.opponent}`
            : game.homeAway === "neutral"
              ? `Nebraska vs ${game.opponent}`
              : `${game.opponent} at Nebraska`,
        startDate: eventStartIso(game),
        location: {
          "@type": "Place",
          name: game.venue,
          address: postalAddress(game.city),
        },
        homeTeam: game.homeAway === "away" ? opponent : nebraska,
        awayTeam: game.homeAway === "away" ? nebraska : opponent,
        url: pageUrl,
      },
    };
  });

  const broadcasts = events
    .filter(({ game }) => game.tv)
    .map(({ id, game }) => ({
      "@type": "BroadcastEvent",
      isLiveBroadcast: true,
      broadcastOfEvent: { "@id": id },
      publishedOn: { "@type": "BroadcastService", name: game.tv },
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        itemListElement: events.map(({ node }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: node,
        })),
      },
      ...broadcasts,
    ],
  };
}

/**
 * FAQPage schema for a set of question/answer pairs — used on the per-game
 * how-to-watch pages so the Q&A can qualify for FAQ rich results.
 */
export function faqJsonLd(questions: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/**
 * A single SportsEvent (+ BroadcastEvent when TV is known) for one game, for
 * the per-game how-to-watch page. Mirrors scheduleJsonLd's modeling: physical
 * location with PostalAddress, TV on a linked BroadcastEvent.
 */
export function gameJsonLd(
  game: ScheduledGame,
  sportLabel: string,
  pageUrl: string
) {
  const id = `${pageUrl}#event`;
  const nebraska = {
    "@type": "SportsTeam",
    name: `Nebraska ${sportLabel}`,
  };
  const opponent = { "@type": "SportsTeam", name: game.opponent };

  const event = {
    "@type": "SportsEvent",
    "@id": id,
    name:
      game.homeAway === "away"
        ? `Nebraska at ${game.opponent}`
        : game.homeAway === "neutral"
          ? `Nebraska vs ${game.opponent}`
          : `${game.opponent} at Nebraska`,
    startDate: eventStartIso(game),
    location: {
      "@type": "Place",
      name: game.venue,
      address: postalAddress(game.city),
    },
    homeTeam: game.homeAway === "away" ? opponent : nebraska,
    awayTeam: game.homeAway === "away" ? nebraska : opponent,
    url: pageUrl,
  };

  const graph: object[] = [event];
  if (game.tv) {
    graph.push({
      "@type": "BroadcastEvent",
      isLiveBroadcast: true,
      broadcastOfEvent: { "@id": id },
      publishedOn: { "@type": "BroadcastService", name: game.tv },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
