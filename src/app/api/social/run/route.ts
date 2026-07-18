import { NextResponse } from "next/server";
import { runSocialEngine } from "@/lib/social/engine";

export const revalidate = 0;

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const cronSecret = process.env.CRON_SECRET;
  return Boolean(cronSecret && token === cronSecret);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runSocialEngine();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
