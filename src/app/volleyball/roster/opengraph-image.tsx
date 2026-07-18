import { ogCard, OG_SIZE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Nebraska Volleyball Roster 2026";

export default function Image() {
  return ogCard({
    kicker: "Go Big Red · 2026",
    title: "Nebraska Volleyball Roster",
    subtitle: "Every player · numbers · positions · the 99-6 senior class",
  });
}
