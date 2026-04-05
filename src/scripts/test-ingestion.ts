/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

async function testEtsy() {
  const apiKey = process.env.ETSY_API_KEY;
  console.log("ETSY_API_KEY set:", !!apiKey, `(${apiKey?.slice(0, 6)}...)`);

  if (!apiKey || apiKey === "your_etsy_api_key") {
    console.error("ETSY_API_KEY not configured");
    return;
  }

  const queries = [
    "nebraska basketball",
    "cornhuskers basketball",
    "huskers basketball shirt",
  ];

  let totalFound = 0;

  for (const q of queries) {
    const url = new URL(
      "https://openapi.etsy.com/v3/application/listings/active"
    );
    url.searchParams.set("keywords", q);
    url.searchParams.set("limit", "5");
    url.searchParams.set("includes", "Images");

    console.log(`\nFetching: ${url.toString()}`);

    const res = await fetch(url.toString(), {
      headers: { "x-api-key": apiKey },
    });

    console.log(`Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const body = await res.text();
      console.error("Error body:", body);
      continue;
    }

    const data = await res.json();
    const results = data.results || [];
    console.log(`Results for "${q}": ${results.length}`);
    totalFound += results.length;

    if (results.length > 0) {
      const sample = results[0];
      console.log("Sample listing:", {
        listing_id: sample.listing_id,
        title: sample.title?.slice(0, 80),
        price: sample.price,
        url: sample.url,
        state: sample.state,
        has_images: !!sample.images?.length,
      });
    }
  }

  console.log(`\nTotal Etsy listings found: ${totalFound}`);
}

async function testEbay() {
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;
  console.log("EBAY_APP_ID set:", !!appId, `(${appId?.slice(0, 12)}...)`);

  if (!appId || appId === "your_ebay_app_id") {
    console.log("\neBay: Skipped (no credentials yet)");
    return;
  }

  // Get OAuth token
  const credentials = Buffer.from(`${appId}:${certId}`).toString("base64");
  const tokenRes = await fetch(
    "https://api.ebay.com/identity/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    }
  );

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    console.error(`Token request failed: ${tokenRes.status}`, body);
    return;
  }

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;
  console.log("Got eBay OAuth token ✓");

  const queries = [
    "nebraska cornhuskers basketball",
    "nebraska huskers football",
    "nebraska cornhuskers volleyball",
  ];

  let totalFound = 0;

  for (const q of queries) {
    const url = new URL(
      "https://api.ebay.com/buy/browse/v1/item_summary/search"
    );
    url.searchParams.set("q", q);
    url.searchParams.set("category_ids", "15687");
    url.searchParams.set("limit", "10");
    url.searchParams.set("filter", "price:[5..300]");

    console.log(`\nFetching: "${q}"`);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      },
    });

    console.log(`Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const body = await res.text();
      console.error("Error body:", body);
      continue;
    }

    const data = await res.json();
    const items = data.itemSummaries || [];
    console.log(`Results for "${q}": ${items.length}`);
    totalFound += items.length;

    // Show up to 3 samples
    for (const item of items.slice(0, 3)) {
      console.log("  →", {
        title: item.title?.slice(0, 80),
        price: item.price?.value ? `$${item.price.value}` : "N/A",
        url: item.itemWebUrl,
      });
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nTotal eBay items found: ${totalFound}`);
}

async function main() {
  console.log("=== Testing Product Ingestion ===\n");

  console.log("--- Etsy ---");
  await testEtsy();

  console.log("\n--- eBay ---");
  await testEbay();

  console.log("\nDone.");
  process.exit(0);
}

main().catch(console.error);
