import { NextResponse } from "next/server";
import { insertClickEvent, incrementClickCount } from "@/lib/supabase/queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, source_page } = body;

    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;

    // Fire both — log errors but never throw
    try {
      await insertClickEvent({
        product_id,
        source_page,
        referrer,
        user_agent: userAgent,
      });
    } catch (err) {
      console.error("insertClickEvent failed:", err);
    }

    try {
      await incrementClickCount(product_id);
    } catch (err) {
      console.error("incrementClickCount failed:", err);
    }
  } catch (err) {
    console.error("track-click parse error:", err);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
