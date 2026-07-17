import { ogCard, OG_SIZE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Nebraska Volleyball Schedule 2026 — dates, times, TV and scores";

export default function Image() {
  return ogCard({
    kicker: "Go Big Red · 2026",
    title: "Nebraska Volleyball Schedule",
    subtitle: "Every match · TV channels · live scores · updated all season",
  });
}
