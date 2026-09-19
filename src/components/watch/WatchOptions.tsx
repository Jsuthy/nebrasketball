import { streamingFor, ticketsFor, type WatchLink } from "@/lib/affiliates/watch";

interface WatchOptionsGame {
  tv: string | null;
  opponent: string;
  sportLabel: string;
}

function ButtonRow({ label, links }: { label: string; links: WatchLink[] }) {
  if (links.length === 0) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="beat-sec" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div className="beat-aff-row">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="beat-aff-link"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function WatchOptions({ game }: { game: WatchOptionsGame }) {
  const streaming = streamingFor(game.tv);
  const tickets = ticketsFor(game.opponent, game.sportLabel);

  return (
    <section className="beat-widget" style={{ marginBottom: 16 }}>
      <h2>Watch / affiliates</h2>
      <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.45 }}>
        Native beat module for {game.sportLabel.toLowerCase()} vs {game.opponent}.
        Fubo, YouTube TV, Sling and tickets sit on the page — not in a signup modal.
      </p>
      <ButtonRow label="Stream this game" links={streaming} />
      <ButtonRow label="Get tickets" links={tickets} />
      <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 12 }}>
        Some links are{" "}
        <a
          href="/affiliate-disclosure"
          style={{ color: "var(--scarlet)", fontWeight: 700 }}
        >
          affiliate links
        </a>
        . Streaming availability depends on your market — check each provider for
        this game.
      </p>
    </section>
  );
}
