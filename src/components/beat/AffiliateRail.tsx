import { streamingFor } from "@/lib/affiliates/watch";

export default function AffiliateRail({
  tv,
  note,
}: {
  tv?: string | null;
  note?: string;
}) {
  const links = streamingFor(tv ?? "BTN");

  return (
    <div className="beat-widget" id="watch">
      <h2>Watch / affiliates</h2>
      <p style={{ margin: "0 0 8px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.45 }}>
        {note ??
          "BTN for football tonight. Hoops channel posts here. Fubo, YouTube TV, Sling — we may earn a commission."}
      </p>
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
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--muted)" }}>
        Native desk module — not a signup modal.{" "}
        <a href="/affiliate-disclosure" style={{ color: "var(--scarlet)", fontWeight: 700 }}>
          Affiliate disclosure
        </a>
      </p>
    </div>
  );
}
