import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  return NextResponse.json({ articles: [] });
}

export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const secret = process.env.INGEST_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, content, excerpt, published_at } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, content" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("news_posts").upsert(
      {
        slug,
        title,
        content,
        excerpt: excerpt || null,
        published_at: published_at || new Date().toISOString(),
        is_published: true,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error("News upsert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error("News POST error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
