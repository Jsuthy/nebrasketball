import type { GameWithResult } from "@/lib/schedule/types";

// The one full-saturation scarlet moment on the page: a color-blocked
// "next game" banner (brand color on a bounded element, white text ≥6:1).
export default function NextGameCard({
  game,
  record,
  sportLabel,
}: {
  game: GameWithResult;
  record: { wins: number; losses: number };
  sportLabel: string;
}) {
  const [year, month, day] = game.date.split("-").map(Number);
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hasRecord = record.wins + record.losses > 0;
  const matchupLabel =
    game.homeAway === "away"
      ? `at ${game.opponent}`
      : `vs ${game.opponent}`;

  return (
    <div
      style={{
        background: "linear-gradient(120deg, var(--red) 0%, var(--red-dk) 100%)",
        borderRadius: 8,
        padding: "26px 30px",
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        alignItems: "flex-end",
        justifyContent: "space-between",
        clipPath:
          "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Next {sportLabel} Match
          {hasRecord && (
            <span className="font-data" style={{ marginLeft: 10 }}>
              {record.wins}–{record.losses}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(30px, 5vw, 46px)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.95,
            color: "#fff",
          }}
        >
          Nebraska <span style={{ color: "var(--cream)" }}>{matchupLabel}</span>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          {dateLabel}
          {game.time ? ` · ${game.time}` : " · Time TBA"} · {game.venue}, {game.city}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 16,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          padding: "10px 20px",
          background: "rgba(0,0,0,0.28)",
          borderRadius: 4,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {game.tv ? `TV: ${game.tv}` : "TV: TBA"}
      </div>
    </div>
  );
}
