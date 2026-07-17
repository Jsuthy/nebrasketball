import type { GameWithResult } from "@/lib/schedule/types";

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

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--red)",
        background: "var(--s1)",
        borderRadius: 4,
        padding: "18px 22px",
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--red)",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Next {sportLabel} Match{hasRecord ? ` · Huskers ${record.wins}–${record.losses}` : ""}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}
        >
          {game.homeAway === "away" ? "Nebraska at " : "Nebraska vs "}
          {game.opponent}
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
          {dateLabel}
          {game.time ? ` · ${game.time}` : " · Time TBA"} · {game.venue},{" "}
          {game.city}
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 15,
          textTransform: "uppercase",
          padding: "10px 20px",
          border: "1px solid var(--border)",
          borderRadius: 2,
          background: "var(--s2)",
          whiteSpace: "nowrap",
        }}
      >
        {game.tv ? `📺 ${game.tv}` : "TV: TBA"}
      </div>
    </div>
  );
}
