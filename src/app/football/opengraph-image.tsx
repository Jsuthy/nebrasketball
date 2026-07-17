import { ogCard, OG_SIZE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Nebraska Football Schedule 2026 — kickoff times, TV and scores";

export default function Image() {
  return ogCard({
    kicker: "Go Big Red · 2026",
    title: "Nebraska Football Schedule",
    subtitle: "Every game · kickoff times · TV channels · live scores",
  });
}
