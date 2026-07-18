import type { Metadata } from "next";
import SchedulePageContent from "@/components/schedule/SchedulePageContent";
import HighlightsRail from "@/components/media/HighlightsRail";
import { FOOTBALL_2026 } from "@/lib/schedule/data";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Nebraska Football Schedule 2026 — Kickoff Times, TV & How to Watch",
  description:
    "Full 2026 Nebraska football schedule with kickoff times, TV channels, live scores, and how to watch every Husker game — from the Ohio opener to Black Friday at Iowa. Auto-updated all season.",
  alternates: { canonical: "/football" },
  openGraph: {
    title: "Nebraska Football Schedule 2026 — TV, Kickoffs & Scores",
    description:
      "Every 2026 Husker football game: dates, kickoff times, TV channels, and live scores. Updated automatically all season.",
  },
};

const HOW_TO_WATCH = [
  {
    label: "FOX family & CBS",
    body: "Nebraska's announced 2026 broadcasts so far: the Ohio opener and Bowling Green on FS1, the Friday-night Illinois game on FOX, and the Black Friday finale at Iowa on CBS. Big Ten games land on FOX, CBS, NBC, or BTN — kickoff times and networks for most games are announced 6–12 days out, and this page updates automatically when they are.",
  },
  {
    label: "BTN & streaming",
    body: "BTN games (like the September 19 North Dakota night game) are available on most cable/satellite packages and live-TV streamers including YouTube TV, Hulu + Live TV, and Fubo. NBC games also stream on Peacock.",
  },
  {
    label: "Listen / follow live",
    body: "The Husker Radio Network carries every game statewide, and live scores appear right on this page on game days.",
  },
];

export default function FootballPage() {
  return (
    <SchedulePageContent
      schedule={FOOTBALL_2026}
      pagePath="/football"
      heroKicker="Go Big Red · 2026 Season"
      heroTitle="Nebraska Football Schedule 2026"
      intro="Every Husker football game in one place — dates, kickoff times, TV channels, and live scores, updated automatically all season. Nebraska opens at home against Ohio on September 5, hosts Ohio State on November 21, and closes Black Friday at Iowa in the Heroes Game."
      howToWatch={HOW_TO_WATCH}
      rankingsNote="Updates automatically when new rankings are released."
      gearSlug="football"
      extraSection={<HighlightsRail sport="football" title="Latest Football Video" />}
    />
  );
}
