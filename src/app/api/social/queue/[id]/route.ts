import { NextResponse } from "next/server";
import { decideQuote } from "@/lib/social/quote-queue";

export const revalidate = 0;

function isAuthorized(request: Request): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return false;
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${adminToken}`) return true;
  const token = new URL(request.url).searchParams.get("token");
  return token === adminToken;
}

// Approve (posts the quote-tweet now) or reject a pending candidate.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: { decision?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.decision !== "approve" && body.decision !== "reject") {
    return NextResponse.json(
      { error: "decision must be 'approve' or 'reject'" },
      { status: 400 }
    );
  }
  const result = await decideQuote(id, body.decision);
  const httpStatus = result.ok ? 200 : result.status === "failed" ? 502 : 400;
  return NextResponse.json(result, { status: httpStatus });
}
