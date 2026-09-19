# Design options v2 (preview only)

Jeff rejected **A · Scorebug Dense** and **B · Rundown Editorial** (PR #2). This pack does **not** restyle production and does **not** recreate those looks.

Static HTML, `noindex`, served from `public/design-options-v2/`. Robots disallow `/design-options-v2/`.

## Index

`/design-options-v2/` — cards, one-sentence diffs, desktop + mobile thumbs.

## Options (C–J)

| Letter | Name | One-sentence difference | Home |
| --- | --- | --- | --- |
| **C** | **Schedule Desk** | Athletic-dept schedule hub: black mast + sport tabs + scarlet stats strip + full slate table (huskers.com / Big Ten peer density, no official marks). | `c.html` |
| **D** | **Gamecast Grid** | ESPN/CBS chrome: scorecells across the top, sticky game header, period boxes, play-by-play — not A’s paper scorebug. | `d.html` |
| **E** | **Beat Desk** | SB Nation stack: lead + thumbnail river + right-rail scores. Denser sports site than rejected B; not a newsprint column. | `e.html` |
| **F** | **Tipoff Overlay** | Photo-forward game-day: arena hero (~52vh) with overlay score, slate below — sports, not a 100vh museum. | `f.html` |
| **G** | **Arena Night** | Dark stadium night: LED chips, scarlet pinstripe, night photo energy — atmospheric, not D’s broadcast grid. | `g.html` |
| **H** | **Agate Page** | Print sports page: nameplate + three-column agate / box scores. Dense type tables, not B’s editorial rundown. | `h.html` |
| **I** | **Call Sheet** | Radio booth wildcard: yellow legal pad, timed cues and outcues — a producer sheet, not A’s rundown list. | `i.html` |
| **J** | **Recruit Board** | Recruiting-board wildcard: cork cards for returners/transfers plus the dated game list. | `j.html` |

Screenshots: `public/design-options-v2/shots/*-home-desktop.png` and `*-home-mobile.png`.

How-to-watch pages were skipped (home mocks are the priority).

## Shared constraints

- BB-first IA; football and volleyball demoted
- Scarlet accent only (`#c8102e`–`#e41c38`)
- Hard UNL independent disclaimer on every mock
- Native email + affiliate rows (not a SaaS modal)
- No Inter / Geist / Space Grotesk, no purple gradients, no 3-feature heroes, no frosted glass, no numbered kickers, no SaaS blue / Stripe navy
- No UNL logos, wordmarks, or fake-official lockups
- Fonts by option: Oswald+Source Sans 3 (C), Roboto Condensed+Roboto (D), Libre Franklin (E), Bebas Neue+Source Sans 3 (F), Anton+IBM Plex Sans (G), Tinos+Roboto Condensed (H), Special Elite+IBM Plex Mono (I), Anton+Cabin (J)

## Not in this PR

No production restyle, no shop revival, no AdSense UI, no merge-as-live-site. Pick a letter; a later PR restyles chrome.
