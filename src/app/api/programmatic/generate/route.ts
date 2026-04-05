import { NextResponse } from "next/server";
import { generateProgrammaticPages } from "@/lib/programmatic/generate-pages";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const validToken =
    process.env.INGEST_SECRET || process.env.CRON_SECRET;

  if (!token || token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateProgrammaticPages();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
