import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const adminToken = process.env.ADMIN_TOKEN;
  const ingestSecret = process.env.INGEST_SECRET;
  if (adminToken && token === adminToken) return true;
  if (ingestSecret && token === ingestSecret) return true;
  return false;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const supabase = await createClient();
    let featured: boolean;

    try {
      const body = await request.json();
      featured = body.featured;
    } catch {
      // No body or invalid JSON — toggle current value
      const { data: current } = await supabase
        .from("products")
        .select("is_featured")
        .eq("id", id)
        .single();
      featured = !(current?.is_featured ?? false);
    }

    const { data, error } = await supabase
      .from("products")
      .update({ is_featured: featured })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
