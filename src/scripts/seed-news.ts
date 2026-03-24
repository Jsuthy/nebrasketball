import { createClient } from "../lib/supabase/server";
import { FALLBACK_NEWS } from "../lib/news-data";

async function main() {
  const supabase = await createClient();

  for (const post of FALLBACK_NEWS) {
    const { error } = await supabase.from("news_posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        published_at: post.published_at,
        is_published: true,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Failed to upsert news "${post.slug}":`, error.message);
    } else {
      console.log(`Upserted news: ${post.slug}`);
    }
  }

  console.log("Done seeding news.");
}

main().catch(console.error);
