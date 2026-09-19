export type ScoreLine = {
  left: string;
  right: string;
  next?: boolean;
};

export default function ScoreboardWidget({
  title = "Scoreboard",
  lines,
}: {
  title?: string;
  lines: ScoreLine[];
}) {
  return (
    <div className="beat-widget">
      <h2>{title}</h2>
      {lines.map((line) => (
        <div
          key={`${line.left}-${line.right}`}
          className={`beat-scoreline${line.next ? " is-next" : ""}`}
        >
          <span>{line.left}</span>
          <span>{line.right}</span>
        </div>
      ))}
    </div>
  );
}
