// Locally hosted, freely licensed photos. CC licenses require visible
// attribution with a link to the source page — PhotoCredit renders it.

export interface SitePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  creditUrl: string;
}

export const PHOTOS = {
  volleyballDay: {
    src: "/photos/volleyball-day-flyover.jpg",
    width: 1920,
    height: 1277,
    alt: "Flyover above a sold-out Memorial Stadium set up for Volleyball Day in Nebraska",
    credit: "Photo: The National Guard (public domain)",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:National_Guard_Memorial_Stadium_volleyball_flyover.jpg",
  },
  memorialStadium: {
    src: "/photos/memorial-stadium.jpg",
    width: 1920,
    height: 1440,
    alt: "Memorial Stadium field and stands in Lincoln, Nebraska",
    credit: "Photo: GoBlue9 / CC BY-SA 4.0",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Memorial_Stadium_in_Nebraska.jpg",
  },
  pinnacleBankArena: {
    src: "/photos/pinnacle-bank-arena.jpg",
    width: 1920,
    height: 1280,
    alt: "Pinnacle Bank Arena exterior in Lincoln, Nebraska",
    credit: "Photo: Tony Webster / CC BY 2.0",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Pinnacle_Bank_Arena_-_Lincoln_-_Nebraska_(52882190195).jpg",
  },
  devaneyMatch: {
    src: "/photos/devaney-match.jpg",
    width: 640,
    height: 480,
    alt: "Nebraska volleyball match in front of a packed Bob Devaney Sports Center crowd",
    credit: "Photo: Thundrplaya / CC BY-SA 3.0",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:NebraskaPennStVolleyball2013.jpg",
  },
} satisfies Record<string, SitePhoto>;
