// 2026 Nebraska volleyball roster — verified against huskers.com (July 2026),
// cross-checked with independent reporting. Facts (names, numbers, heights)
// are not copyrightable; refresh next season.

export interface RosterPlayer {
  num: number;
  name: string;
  pos: string;
  height: string;
  year: string;
  hometown: string;
  note?: string;
}

export const VOLLEYBALL_COACH = "Dani Busboom Kelly";
export const VOLLEYBALL_COACH_NOTE =
  "Second season as head coach — the fourth in program history, succeeding John Cook after his 25-season run.";

export const VOLLEYBALL_ROSTER_2026: RosterPlayer[] = [
  { num: 1, name: "Keri Leimbach", pos: "DS/L", height: "5-4", year: "R-Freshman", hometown: "Lincoln, NE" },
  { num: 2, name: "Bergen Reilly", pos: "S", height: "6-1", year: "Senior", hometown: "Sioux Falls, SD", note: "Three-year starting setter · USA national-team camp selection" },
  { num: 3, name: "Virginia Adriano", pos: "OPP", height: "6-5", year: "Sophomore", hometown: "Turin, Italy" },
  { num: 4, name: "Campbell Flynn", pos: "S", height: "6-3", year: "Sophomore", hometown: "Oakland, MI" },
  { num: 6, name: "Laney Choboy", pos: "DS/L", height: "5-3", year: "Senior", hometown: "Raleigh, NC" },
  { num: 8, name: "Kenna Cogill", pos: "MB", height: "6-4", year: "R-Freshman", hometown: "Gilbert, AZ" },
  { num: 10, name: "Olivia Mauch", pos: "DS/L", height: "5-6", year: "Junior", hometown: "Bennington, NE" },
  { num: 11, name: "Teraya Sigler", pos: "OH", height: "6-3", year: "Sophomore", hometown: "Scottsdale, AZ" },
  { num: 14, name: "Manaia Ogbechie", pos: "MB", height: "6-3", year: "Sophomore", hometown: "Santa Rosa Valley, CA" },
  { num: 15, name: "Andi Jackson", pos: "MB", height: "6-3", year: "Senior", hometown: "Brighton, CO", note: "Elite blocker · USA national-team camp selection" },
  { num: 17, name: "Keoni Williams", pos: "MB", height: "6-4", year: "Freshman", hometown: "Fort Worth, TX" },
  { num: 18, name: "Ryan Hunter", pos: "OPP", height: "6-2", year: "R-Freshman", hometown: "Charlotte, NC" },
  { num: 20, name: "Jayden Robinson", pos: "OH", height: "6-3", year: "Freshman", hometown: "Missouri City, TX" },
  { num: 21, name: "Skyler Pierce", pos: "OH", height: "6-2", year: "Sophomore", hometown: "Lenexa, KS" },
  { num: 23, name: "Gabby DiVita", pos: "OH", height: "6-1", year: "Freshman", hometown: "Grosse Pointe Farms, MI" },
  { num: 27, name: "Harper Murray", pos: "OH", height: "6-2", year: "Senior", hometown: "Ann Arbor, MI", note: "Star outside hitter · USA national-team camp selection" },
];

export const ROSTER_STORYLINE =
  "The senior class of Murray, Jackson, Reilly, and Choboy is 99-6 over the last three seasons, and eight Huskers were invited to the 2026 USA national-team collegiate camp.";
