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
