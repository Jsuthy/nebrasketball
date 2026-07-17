// 2026-27 Nebraska men's basketball — announced games only, verified against
// huskers.com plus opponent/press sources (July 2026). The full Big Ten
// schedule with dates and TV lands in Aug-Sep; until then conference games
// are listed as opponents without dates. Do not present Nov 7 as the
// confirmed season opener — home nonconference games are still unannounced.

export interface AnnouncedGame {
  date: string | null;
  opponent: string;
  homeAway: "home" | "away" | "neutral";
  venue: string;
  city: string;
  note: string | null;
}

export const ANNOUNCED_GAMES_2026_27: AnnouncedGame[] = [
  { date: "2026-10-16", opponent: "BYU", homeAway: "away", venue: "Marriott Center", city: "Provo, UT", note: "Exhibition — first game in Provo since 1935" },
  { date: "2026-11-07", opponent: "Providence", homeAway: "neutral", venue: "Mohegan Sun Arena", city: "Uncasville, CT", note: "Hall of Fame Tip-Off — first-ever meeting" },
  { date: "2026-11-15", opponent: "Boise State", homeAway: "neutral", venue: "Sanford Pentagon", city: "Sioux Falls, SD", note: null },
  { date: "2026-11-22", opponent: "Butler", homeAway: "neutral", venue: "Credit Union 1 Arena", city: "Chicago, IL", note: "First meeting since the 2019 NIT" },
  { date: "2026-12-05", opponent: "Creighton", homeAway: "away", venue: "CHI Health Center", city: "Omaha, NE", note: "In-state rivalry" },
  { date: "2026-12-12", opponent: "Missouri", homeAway: "neutral", venue: "T-Mobile Center", city: "Kansas City, MO", note: null },
];

export const BIG_TEN_HOME = [
  "Michigan (defending national champion)",
  "Iowa (Sweet 16 rematch)",
  "Ohio State",
  "UCLA",
  "USC",
  "Indiana",
  "Michigan State",
  "Minnesota",
  "Penn State",
  "Rutgers",
];

export const BIG_TEN_AWAY = [
  "Iowa",
  "Illinois (2026 Final Four)",
  "Purdue",
  "Wisconsin",
  "Oregon",
  "Washington",
  "Michigan State",
  "Penn State",
  "Maryland",
  "Northwestern",
];

export const RETURNING = [
  "Pryce Sandfort — Sr. F, first-team All-Big Ten",
  "Braden Frager — RSo. F, Big Ten Sixth Man of the Year",
  "Connor Essegian — RSr. G",
  "Cale Jacobsen — RSr. G",
  "Leo Curtis — So. F (7'2\")",
  "Henry Burt — RSr. F",
];

export const INCOMING = [
  "Boden Kapke — Sr. F/C (Boston College)",
  "Sam Orme — RJr. F (Belmont)",
  "Taj DeGourville — Jr. G (San Diego State)",
  "Trevan Leonhardt — RSr. G (Utah Valley)",
  "Kadyn Betts — RSr. F (Montana)",
  "Colin Rice — Fr. G/F (Waukee, IA)",
  "Jacob Lanier — Fr. G (Little Rock, AR)",
];
