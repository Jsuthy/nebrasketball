# Nebrasketball Automation

## n8n Workflow 1: Product Refresh
Trigger: Schedule — every 6 hours (0 */6 * * *)
Also runs automatically via Vercel cron

Node 1 — HTTP Request:
  Method: POST
  URL: https://nebrasketball.com/api/ingest
  Headers: Authorization: Bearer {{$env.INGEST_SECRET}}

Node 2 — IF (check result):
  Condition: result.added + result.updated > 0

Node 3 — Slack notification:
  Message: "✅ Nebrasketball ingestion complete: {{result.added}} added, {{result.updated}} updated, {{result.failed}} failed"

## n8n Workflow 2: Game Day Post
Trigger: Manual webhook (fire after Nebraska wins)

Node 1 — Set variables:
  game_result: "Nebraska XX, Opponent XX"
  key_players: "Brice Williams XX pts, Juwan Gary XX pts"
  next_game: "vs [Opponent] [Date] [Time] on [Network]"

Node 2 — AI (Claude API or OpenAI):
  Prompt: Write a 350-word Nebraska basketball game recap article for nebrasketball.com.
  Game: {{game_result}}. Key performers: {{key_players}}. Next game: {{next_game}}.
  Include: game story, key moments, player quotes if available, what it means for the program.
  End with: "Celebrate the win with Nebraska basketball gear at nebrasketball.com"
  Format: Return JSON with fields: title, slug, content (HTML paragraphs), excerpt (1 sentence)

Node 3 — HTTP Request:
  Method: POST
  URL: https://nebrasketball.com/api/news
  Headers: Authorization: Bearer {{$env.INGEST_SECRET}}, Content-Type: application/json
  Body: {{AI response JSON}}

Node 4 — Beehiiv newsletter (wire when list has subscribers):
  POST to Beehiiv API to send "Nebraska just won — gear up!" email

## n8n Workflow 3: Featured Products Rotation
Trigger: Schedule — weekly Monday 8am
Node 1 — HTTP Request GET /api/admin/stats to find top clicked products
Node 2 — For each top product, PATCH /api/products/[id]/feature to mark featured
This keeps the homepage featured grid fresh automatically

## X (@nebrasketball) Auto-Posting — fully automated, no n8n needed

Engine: `src/lib/social/engine.ts`, invoked by Vercel cron every 30 minutes
(`/api/social/run`, Bearer CRON_SECRET — Vercel attaches this automatically).

What it posts, generated from the site's own schedule/scores/rankings data:
- Season countdowns (42/30/21/14/7/3/1 days to each opener, morning window)
- Monday "this week in Husker volleyball/football" look-aheads
- Gameday-morning posts (opponent, time, TV, site link)
- "Starting soon" posts 15–100 minutes before first serve/kick
- Final-score posts as soon as the NCAA scoreboard shows FINAL
- Poll-movement posts when a new AVCA/CFP poll drops (stale off-season
  polls are automatically skipped)

Safety: every post has a deterministic dedup key stored in the Supabase
`social_posts` table (nothing ever double-posts); max 4 posts per run;
template variants are chosen deterministically per key. With no X
credentials configured the engine runs in dry-run mode and reports what it
WOULD post without recording anything.

### One-time setup
1. Run `src/scripts/setup-social-posts.sql` in the Supabase SQL editor.
2. Create an X developer app on the @nebrasketball account
   (developer.x.com → Free tier is enough: ~500 posts/month vs ~60 needed).
   App permissions: **Read and Write**. Generate consumer keys + access
   token/secret for the account.
3. Add to Vercel env (production):
   - `X_API_KEY`, `X_API_SECRET` (consumer key/secret)
   - `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
4. Redeploy. Verify with:
   `curl -H "Authorization: Bearer $CRON_SECRET" https://www.nebrasketball.com/api/social/run`

Basketball is added to the rotation when the 2026-27 schedule converts to
the SeasonSchedule format (after the Big Ten release in Aug-Sep).
