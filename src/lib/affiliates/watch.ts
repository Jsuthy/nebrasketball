// Non-gambling affiliate links for the how-to-watch pages: legal live-TV
// streaming services and ticket marketplaces only. Every link is a working
// deep link on its own; when an affiliate param is configured via env, it is
// appended so the click is monetized. No fake IDs are baked in — if the env
// var is unset the plain (still functional) link is returned.

export interface Provider {
  name: string;
  baseUrl: string;
  /** Env var holding the affiliate query fragment, e.g. "irclickid=abc&..." */
  envKey: string;
}

export interface WatchLink {
  name: string;
  url: string;
}

// --- Streaming providers -------------------------------------------------

const FUBO: Provider = {
  name: "Fubo",
  baseUrl: "https://www.fubo.tv/",
  envKey: "NEXT_PUBLIC_FUBO_AFF",
};
const DIRECTV_STREAM: Provider = {
  name: "DirecTV Stream",
  baseUrl: "https://streamtv.directv.com/",
  envKey: "NEXT_PUBLIC_DIRECTV_AFF",
};
const SLING: Provider = {
  name: "Sling",
  baseUrl: "https://www.sling.com/",
  envKey: "NEXT_PUBLIC_SLING_AFF",
};
const YOUTUBE_TV: Provider = {
  name: "YouTube TV",
  baseUrl: "https://tv.youtube.com/",
  envKey: "NEXT_PUBLIC_YOUTUBETV_AFF",
};
const PEACOCK: Provider = {
  name: "Peacock",
  baseUrl: "https://www.peacocktv.com/",
  envKey: "NEXT_PUBLIC_PEACOCK_AFF",
};
const PARAMOUNT_PLUS: Provider = {
  name: "Paramount+",
  baseUrl: "https://www.paramountplus.com/",
  envKey: "NEXT_PUBLIC_PARAMOUNT_AFF",
};

/** Append the env-configured affiliate query fragment when it exists. */
function withAffiliate(provider: Provider): WatchLink {
  const param = process.env[provider.envKey];
  if (!param) return { name: provider.name, url: provider.baseUrl };
  const separator = provider.baseUrl.includes("?") ? "&" : "?";
  return {
    name: provider.name,
    url: `${provider.baseUrl}${separator}${param}`,
  };
}

/**
 * Live-TV streamers that carry the game's announced network. Falls back to a
 * sensible default set when the network is unknown/unannounced.
 */
export function streamingFor(tv: string | null): WatchLink[] {
  const upper = (tv ?? "").toUpperCase();

  let providers: Provider[];
  if (upper.includes("BTN") || upper.includes("BIG TEN")) {
    providers = [FUBO, YOUTUBE_TV, SLING];
  } else if (upper.includes("PEACOCK") || upper.includes("NBC")) {
    // NBC games also stream on Peacock; NBC itself is on the live-TV bundles.
    providers = upper.includes("NBC")
      ? [PEACOCK, FUBO, YOUTUBE_TV]
      : [PEACOCK];
  } else if (upper.includes("FS1") || upper.includes("FOX")) {
    providers = [FUBO, YOUTUBE_TV];
  } else if (upper.includes("CBS") || upper.includes("PARAMOUNT")) {
    providers = [PARAMOUNT_PLUS, FUBO];
  } else if (upper.includes("ESPN")) {
    providers = [FUBO, YOUTUBE_TV];
  } else {
    // Unknown / unannounced network: offer the broadest-carrying bundles.
    providers = [FUBO, YOUTUBE_TV, DIRECTV_STREAM];
  }

  return providers.map(withAffiliate);
}

// --- Ticketing -----------------------------------------------------------

const VIVID_SEATS: Provider = {
  name: "Vivid Seats",
  baseUrl: "https://www.vividseats.com/search",
  envKey: "NEXT_PUBLIC_VIVIDSEATS_AFF",
};
const SEATGEEK: Provider = {
  name: "SeatGeek",
  baseUrl: "https://seatgeek.com/search",
  envKey: "NEXT_PUBLIC_SEATGEEK_AFF",
};

/** Ticket-marketplace search links for a specific matchup. */
export function ticketsFor(opponent: string, sportLabel: string): WatchLink[] {
  const query = `Nebraska ${opponent} ${sportLabel} tickets`;

  const vividUrl = `${VIVID_SEATS.baseUrl}?searchTerm=${encodeURIComponent(query)}`;
  const seatgeekUrl = `${SEATGEEK.baseUrl}?search=${encodeURIComponent(query)}`;

  return [
    appendParam({ name: VIVID_SEATS.name, url: vividUrl }, VIVID_SEATS.envKey),
    appendParam({ name: SEATGEEK.name, url: seatgeekUrl }, SEATGEEK.envKey),
  ];
}

/** Append an env-configured affiliate query fragment to a built URL. */
function appendParam(link: WatchLink, envKey: string): WatchLink {
  const param = process.env[envKey];
  if (!param) return link;
  const separator = link.url.includes("?") ? "&" : "?";
  return { name: link.name, url: `${link.url}${separator}${param}` };
}
