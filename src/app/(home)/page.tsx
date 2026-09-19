import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/constants";
import { SITE_DISCLAIMER, buildMetaDescription } from "@/lib/compliance";
import { getNewsPosts } from "@/lib/supabase/queries";
import { FALLBACK_NEWS } from "@/lib/news-data";
import { BASKETBALL_2026 } from "@/lib/schedule/data";
import { attachResults, nextGame, record } from "@/lib/schedule/results";
import { getNextGameForSport } from "@/lib/schedule/games";
import { PHOTOS } from "@/lib/media/photos";
import EmailCapture from "@/components/ui/EmailCapture";
import AffiliateRail from "@/components/beat/AffiliateRail";
import ScoreboardWidget, { type ScoreLine } from "@/components/beat/ScoreboardWidget";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Nebrasketball — Nebraska Men’s Basketball Beat Desk",
  description: buildMetaDescription(
    "Next Nebraska men’s basketball game, how to watch, live scores, record and 2026-27 season HQ. Independent Husker fan site. GBR."
  ),
  openGraph: {
    title: "Nebrasketball — Nebraska Men’s Basketball Beat Desk",
    description: buildMetaDescription(
      "Next Nebraska men’s basketball game, how to watch, live scores and season HQ."
    ),
    url: SITE_URL,
    type: "website",
  },
};

const LAST_RUN: ScoreLine[] = [
  { left: "NEB 71", right: "IOWA 77" },
  { left: "NEB 74", right: "VAN 72" },
  { left: "NEB 76", right: "TROY 47" },
];

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function Home() {
  let newsPosts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string;
  }> = [];
  try {
    newsPosts = await getNewsPosts(3);
  } catch {
    // Supabase unavailable
  }
  if (newsPosts.length === 0) {
    newsPosts = FALLBACK_NEWS;
  }

  const bb = await attachResults(BASKETBALL_2026);
  const upcoming = nextGame(bb);
  const watch = getNextGameForSport("basketball");
  const seasonRecord = record(bb);
  const live = bb.find((g) => g.result?.state === "live") ?? null;
  const finals = bb
    .filter((g) => g.result?.state === "final")
    .slice(-3)
    .reverse();

  const scoreLines: ScoreLine[] = [
    ...(live
      ? [
          {
            left: `NEB ${live.result?.nebraskaScore ?? ""}`,
            right: `${live.opponent.toUpperCase().slice(0, 8)} ${live.result?.opponentScore ?? ""}`,
          },
        ]
      : []),
    ...finals.map((g) => ({
      left: `NEB ${g.result?.nebraskaScore ?? ""}`,
      right: `${g.opponent.toUpperCase().slice(0, 8)} ${g.result?.opponentScore ?? ""}`,
    })),
    ...(finals.length === 0 && !live ? LAST_RUN : []),
    upcoming
      ? {
          left: `Next: ${upcoming.homeAway === "away" ? "at" : "vs"} ${upcoming.opponent}`,
          right: formatShort(upcoming.date),
          next: true,
        }
      : { left: "Next: at BYU", right: "Oct 16", next: true },
  ];

  const recordLine =
    seasonRecord.wins + seasonRecord.losses > 0
      ? `${seasonRecord.wins}–${seasonRecord.losses}`
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nebrasketball",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/how-to-watch`,
      },
      "query-input": "required name=search_term",
    },
  };

  const leadPhoto = PHOTOS.pinnacleBankArena;
  const river = [
    {
      href: "/basketball",
      photo: PHOTOS.devaneyMatch,
      kicker: "Roster",
      title: "Sandfort back, Kapke in, the frontcourt is the story",
      meta: "Returning All-Big Ten forward plus a Boston College transfer. Full board on the basketball page.",
    },
    {
      href: watch ? `/how-to-watch/${watch.slug}` : "/how-to-watch",
      photo: PHOTOS.memorialStadium,
      kicker: "How to watch",
      title: upcoming
        ? `${upcoming.homeAway === "away" ? "at" : "vs"} ${upcoming.opponent} — TV still TBA`
        : "No MBB channel yet. Football is BTN if you need a set.",
      meta: "Affiliate row in the rail — not a signup modal.",
    },
    {
      href: "/basketball",
      photo: PHOTOS.volleyballDay,
      kicker: "Neutral sites",
      title: "Providence, Boise State, Butler, then Creighton in Omaha",
      meta: "Hall of Fame Tip-Off through the rivalry week. TV TBA.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="beat-wrap">
        <div className="beat-stack">
          <div>
            <article className="beat-lead">
              <Link href="/basketball" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <Image
                  src={leadPhoto.src}
                  alt={leadPhoto.alt}
                  width={leadPhoto.width}
                  height={leadPhoto.height}
                  priority
                  className="beat-lead-photo"
                  sizes="(max-width: 760px) 100vw, 680px"
                />
                <div className="beat-pad">
                  <div className="beat-sec">Men’s basketball · Lincoln</div>
                  <h1>
                    Iowa and Michigan both come home. The Sweet 16 hangover has a
                    schedule now.
                  </h1>
                  <p>
                    First tournament win, first Sweet 16, then a 77–71 loss to
                    Iowa. The rematch is at Pinnacle Bank Arena. So is defending
                    champ Michigan. Dates for those Big Ten nights are still TBA
                    — the announced nonconference slate starts Oct. 16 at BYU.
                    {recordLine ? ` Season record ${recordLine}.` : ""}
                    {live
                      ? ` Live ${live.result?.nebraskaScore ?? ""}–${live.result?.opponentScore ?? ""} ${live.opponent}.`
                      : ""}
                  </p>
                </div>
              </Link>
            </article>

            <div className="beat-river" id="river">
              {river.map((item) => (
                <Link key={item.kicker} href={item.href} className="beat-story">
                  <Image
                    src={item.photo.src}
                    alt={item.photo.alt}
                    width={184}
                    height={136}
                    className="beat-thumb"
                  />
                  <div>
                    <div className="beat-sec">{item.kicker}</div>
                    <h3>{item.title}</h3>
                    <span>{item.meta}</span>
                  </div>
                </Link>
              ))}
              {newsPosts.slice(0, 2).map((post) => (
                <Link key={post.slug} href={`/news/${post.slug}`} className="beat-story">
                  <Image
                    src={PHOTOS.devaneyMatch.src}
                    alt=""
                    width={184}
                    height={136}
                    className="beat-thumb"
                  />
                  <div>
                    <div className="beat-sec">Notes</div>
                    <h3>{post.title}</h3>
                    <span>{post.excerpt}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="beat-rail">
            <ScoreboardWidget lines={scoreLines} />
            <AffiliateRail
              tv={upcoming?.tv ?? "BTN"}
              note={
                upcoming
                  ? `${upcoming.homeAway === "away" ? "at" : "vs"} ${upcoming.opponent} ${formatShort(upcoming.date)}. Hoops channel posts here. Fubo, YouTube TV, Sling — we may earn a commission.`
                  : undefined
              }
            />
            <EmailCapture source="home" variant="rail" />
            <div className="beat-widget">
              <h2>Desk links</h2>
              <div style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
                <Link href="/basketball" style={{ textDecoration: "none" }}>
                  Basketball HQ →
                </Link>
                <Link href="/how-to-watch" style={{ textDecoration: "none" }}>
                  Does Nebraska play today? →
                </Link>
                <Link href="/scores" style={{ textDecoration: "none" }}>
                  Live scoreboard →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <p className="beat-disclaimer" id="other">
          {SITE_DISCLAIMER} Photo: Tony Webster / CC BY 2.0 (arena); other images
          credited on the live site. Football and volleyball are rail/demoted.
          Watch links may be affiliates.
        </p>
      </div>
    </>
  );
}
