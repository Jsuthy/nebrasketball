import type { SeasonSchedule } from "./types";

// Schedules verified against huskers.com (2026 releases). Times/TV marked
// null are unannounced — Big Ten broadcast assignments land in waves, and
// results attach automatically from the scores API once games are played.

export const VOLLEYBALL_2026: SeasonSchedule = {
  sport: "volleyball-women",
  sportLabel: "Volleyball",
  seasonLabel: "2026",
  games: [
    { date: "2026-08-29", time: "9:00 PM CT", opponent: "UNLV", homeAway: "neutral", venue: "T-Mobile Arena", city: "Las Vegas, NV", tv: null, note: "Season opener · Players Era Showcase" },
    { date: "2026-08-30", time: "1:30 PM CT", opponent: "Texas", homeAway: "neutral", venue: "T-Mobile Arena", city: "Las Vegas, NV", tv: null, note: "Players Era Showcase" },
    { date: "2026-09-02", time: "7:00 PM CT", opponent: "South Dakota State", homeAway: "away", venue: "First Bank & Trust Arena", city: "Brookings, SD", tv: null, note: null },
    { date: "2026-09-04", time: null, opponent: "DePaul", homeAway: "away", venue: "Wintrust Arena", city: "Chicago, IL", tv: null, note: null },
    { date: "2026-09-06", time: null, opponent: "Missouri", homeAway: "neutral", venue: "Wrigley Field", city: "Chicago, IL", tv: "FOX", note: "Big Ten/SEC Challenge — outdoors at Wrigley Field" },
    { date: "2026-09-10", time: null, opponent: "New Mexico", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Home opener · Ameritas Players Challenge" },
    { date: "2026-09-11", time: null, opponent: "Baylor", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Ameritas Players Challenge" },
    { date: "2026-09-12", time: null, opponent: "Georgia Tech", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Ameritas Players Challenge" },
    { date: "2026-09-16", time: null, opponent: "Creighton", homeAway: "home", venue: "Pinnacle Bank Arena", city: "Lincoln, NE", tv: null, note: "In-state rivalry — at Pinnacle Bank Arena" },
    { date: "2026-09-18", time: null, opponent: "North Carolina", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Husker Invitational" },
    { date: "2026-09-20", time: "12:00 PM CT", opponent: "Florida Gulf Coast", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Husker Invitational" },
    { date: "2026-09-25", time: null, opponent: "Rutgers", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Big Ten opener" },
    { date: "2026-09-26", time: null, opponent: "Ohio State", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-10-01", time: null, opponent: "Penn State", homeAway: "away", venue: "Rec Hall", city: "University Park, PA", tv: null, note: null },
    { date: "2026-10-03", time: null, opponent: "Maryland", homeAway: "away", venue: "XFINITY Center", city: "College Park, MD", tv: null, note: null },
    { date: "2026-10-08", time: null, opponent: "Indiana", homeAway: "away", venue: "Wilkinson Hall", city: "Bloomington, IN", tv: null, note: null },
    { date: "2026-10-10", time: null, opponent: "Wisconsin", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Big Ten rivalry" },
    { date: "2026-10-15", time: null, opponent: "Northwestern", homeAway: "away", venue: "Welsh-Ryan Arena", city: "Evanston, IL", tv: null, note: null },
    { date: "2026-10-17", time: null, opponent: "Purdue", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-10-22", time: null, opponent: "UCLA", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-10-24", time: null, opponent: "USC", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-10-30", time: null, opponent: "Michigan", homeAway: "away", venue: "Crisler Center", city: "Ann Arbor, MI", tv: null, note: null },
    { date: "2026-10-31", time: null, opponent: "Michigan State", homeAway: "away", venue: "Breslin Center", city: "East Lansing, MI", tv: null, note: null },
    { date: "2026-11-07", time: null, opponent: "Oregon", homeAway: "away", venue: "Matthew Knight Arena", city: "Eugene, OR", tv: null, note: null },
    { date: "2026-11-08", time: null, opponent: "Washington", homeAway: "away", venue: "Alaska Airlines Arena", city: "Seattle, WA", tv: null, note: null },
    { date: "2026-11-12", time: null, opponent: "Illinois", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-11-14", time: null, opponent: "Iowa", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-11-17", time: null, opponent: "Minnesota", homeAway: "home", venue: "Bob Devaney Sports Center", city: "Lincoln, NE", tv: null, note: "Regular-season home finale" },
  ],
};

export const FOOTBALL_2026: SeasonSchedule = {
  sport: "football",
  sportLabel: "Football",
  seasonLabel: "2026",
  games: [
    { date: "2026-09-05", time: "11:00 AM CT", opponent: "Ohio", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: "FS1", note: "Season opener" },
    { date: "2026-09-12", time: "6:00 PM CT", opponent: "Bowling Green", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: "FS1", note: "Night game" },
    { date: "2026-09-19", time: "6:15 PM CT", opponent: "North Dakota", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: "BTN", note: "Night game" },
    { date: "2026-09-26", time: null, opponent: "Michigan State", homeAway: "away", venue: "Spartan Stadium", city: "East Lansing, MI", tv: null, note: "Big Ten opener" },
    { date: "2026-10-03", time: null, opponent: "Maryland", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: null, note: "Homecoming" },
    { date: "2026-10-10", time: null, opponent: "Indiana", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-10-17", time: null, opponent: "Oregon", homeAway: "away", venue: "Autzen Stadium", city: "Eugene, OR", tv: null, note: "Bye week follows" },
    { date: "2026-10-31", time: null, opponent: "Washington", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: null, note: "Halloween game" },
    { date: "2026-11-06", time: "7:00 PM CT", opponent: "Illinois", homeAway: "away", venue: "Memorial Stadium", city: "Champaign, IL", tv: "FOX", note: "Friday night game" },
    { date: "2026-11-14", time: null, opponent: "Rutgers", homeAway: "away", venue: "SHI Stadium", city: "Piscataway, NJ", tv: null, note: null },
    { date: "2026-11-21", time: null, opponent: "Ohio State", homeAway: "home", venue: "Memorial Stadium", city: "Lincoln, NE", tv: null, note: null },
    { date: "2026-11-27", time: "11:00 AM CT", opponent: "Iowa", homeAway: "away", venue: "Kinnick Stadium", city: "Iowa City, IA", tv: "CBS", note: "Black Friday · Heroes Game · regular-season finale" },
  ],
};
