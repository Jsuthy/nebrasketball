import { ogCard, OG_SIZE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Nebrasketball — Nebraska Basketball HQ";

export default function Image() {
  return ogCard({
    kicker: "This Is Nebrasketball",
    title: "Nebraska Basketball HQ",
    subtitle: "Sweet 16 momentum · schedule · live scores · rankings",
  });
}
