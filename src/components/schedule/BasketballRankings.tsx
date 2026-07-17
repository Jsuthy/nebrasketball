import { getRankings } from "@/lib/ncaa/api";

export default async function BasketballRankings() {
  const rankings = await getRankings("basketball-men");
  if (!rankings || rankings.rows.length === 0) return null;
  const top10 = rankings.rows.slice(0, 10);
  const nebraskaRow = rankings.rows.find((r) =>
    r.team.toLowerCase().startsWith("nebraska")
  );
  const shown =
    nebraskaRow && !top10.includes(nebraskaRow) ? [...top10, nebraskaRow] : top10;

  return (
    <section style={{ marginTop: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: 17,
          fontWeight: 800,
          margin: "0 0 14px",
        }}
      >
        {rankings.title}
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 12px" }}>
        {rankings.updated} · Updates automatically when new polls are released.
      </p>
      <div style={{ border: "1px solid var(--border)", borderRadius: 4 }}>
        {shown.map((row) => {
          const isNebraska = row.team.toLowerCase().startsWith("nebraska");
          return (
            <div
              key={row.rank}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 16px",
                borderTop: row === shown[0] ? "none" : "1px solid var(--border)",
                background: isNebraska ? "rgba(208,0,0,0.12)" : "transparent",
                fontWeight: isNebraska ? 700 : 400,
                fontSize: 14,
              }}
            >
              <span>
                <span
                  style={{
                    display: "inline-block",
                    width: 28,
                    color: isNebraska ? "var(--red)" : "var(--muted)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                  }}
                >
                  {row.rank}
                </span>
                {row.team}
              </span>
              <span style={{ color: "var(--muted)" }}>{row.record}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
