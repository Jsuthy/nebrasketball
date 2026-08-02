import { streamingFor, ticketsFor, type WatchLink } from "@/lib/affiliates/watch";

// Server component: two compact button rows of non-gambling affiliate links —
// legal live-TV streamers for the game and ticket-marketplace searches.

interface WatchOptionsGame {
  tv: string | null;
  opponent: string;
  sportLabel: string;
}

const rowLabel: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: 12,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 10px",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--cream)",
  background: "var(--s1)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "10px 16px",
  textDecoration: "none",
};

function ButtonRow({ label, links }: { label: string; links: WatchLink[] }) {
  if (links.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={rowLabel}>{label}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            style={buttonStyle}
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
    <section
      style={{
        background: "var(--s1)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--red)",
        borderRadius: 8,
        padding: "20px 22px 16px",
        marginBottom: 40,
      }}
    >
      <ButtonRow label="Stream this game" links={streaming} />
      <ButtonRow label="Get tickets" links={tickets} />
      <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 12 }}>
        Some links are{" "}
        <a
          href="/affiliate-disclosure"
          style={{ color: "var(--red)", fontWeight: 600 }}
        >
          affiliate links
        </a>
        . Streaming availability depends on your market — check each provider for
        this game.
      </p>
    </section>
  );
}
