import { NextResponse } from "next/server";
import { enqueueQuote, listQuotes, type QuoteStatus } from "@/lib/social/quote-queue";

export const revalidate = 0;

function isAuthorized(request: Request): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return false;
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${adminToken}`) return true;
  const token = new URL(request.url).searchParams.get("token");
  return token === adminToken;
}

const STATUSES: QuoteStatus[] = [
  "pending",
  "approved",
  "rejected",
  "posted",
  "failed",
];

// List the review queue (defaults to pending).
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const param = new URL(request.url).searchParams.get("status") ?? "pending";
  const status = param === "all" || STATUSES.includes(param as QuoteStatus)
    ? (param as QuoteStatus | "all")
    : "pending";
  try {
    const items = await listQuotes(status);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}

// Enqueue a candidate. Called by a human today; by an automated monitor later.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: {
    sourceUrl?: string;
    sourceHandle?: string;
    sourceText?: string;
    proposedComment?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const result = await enqueueQuote({
    sourceUrl: body.sourceUrl ?? "",
    sourceHandle: body.sourceHandle ?? null,
    sourceText: body.sourceText ?? null,
    proposedComment: body.proposedComment ?? "",
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ id: result.id });
}
