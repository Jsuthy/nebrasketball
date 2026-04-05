"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatPrice, truncate } from "@/lib/utils";

interface TopProduct {
  id: string;
  title: string;
  source: string;
  price: number | null;
  click_count: number;
  is_featured: boolean;
  slug: string;
  category: string | null;
}

interface Stats {
  totalProducts: number;
  totalClicks: number;
  activeSources: number;
  totalNews: number;
  topProducts: TopProduct[];
  bySport?: Record<string, number>;
  programmaticPages?: number;
}

interface ProgPage {
  id: string;
  slug: string;
  page_type: string;
  sport: string | null;
  product_count: number;
  is_active: boolean;
  created_at: string;
}

function AdminContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"products" | "pages">("products");
  const [pages, setPages] = useState<ProgPage[]>([]);
  const [generatingPages, setGeneratingPages] = useState(false);
  const [pageGenResult, setPageGenResult] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function runIngestion() {
    setIngesting(true);
    setIngestResult(null);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) {
        setIngestResult(`Error: ${data.error}`);
      } else {
        setIngestResult(
          `Added: ${data.added}, Updated: ${data.updated}, Failed: ${data.failed}` +
            (data.errors?.length ? ` | ${data.errors[0]}` : "")
        );
      }
      fetchStats();
    } catch {
      setIngestResult("Network error");
    } finally {
      setIngesting(false);
    }
  }

  async function regeneratePages() {
    setGeneratingPages(true);
    setPageGenResult(null);
    try {
      const res = await fetch("/api/programmatic/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) {
        setPageGenResult(`Error: ${data.error}`);
      } else {
        setPageGenResult(
          `Created: ${data.created}, Skipped: ${data.skipped}`
        );
      }
      fetchStats();
    } catch {
      setPageGenResult("Network error");
    } finally {
      setGeneratingPages(false);
    }
  }

  async function toggleFeatured(productId: string, currentState: boolean) {
    try {
      await fetch(`/api/products/${productId}/feature`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentState }),
      });
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topProducts: prev.topProducts.map((p) =>
            p.id === productId ? { ...p, is_featured: !currentState } : p
          ),
        };
      });
    } catch {
      // silent
    }
  }

  const tabStyle = (tab: string): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "8px 16px",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid var(--red)" : "2px solid transparent",
    background: "transparent",
    color: activeTab === tab ? "white" : "var(--muted)",
    cursor: "pointer",
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1
          className="font-display"
          style={{ fontWeight: 900, fontSize: 36, textTransform: "uppercase", margin: 0 }}
        >
          Admin Dashboard
        </h1>
        {lastRefreshed && (
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            Last refreshed: {lastRefreshed}
          </span>
        )}
      </div>

      {/* Stats grid */}
      {loading ? (
        <div style={{ color: "var(--muted)", padding: 20 }}>Loading stats...</div>
      ) : stats ? (
        <>
          <div className="stats-grid">
            {[
              { label: "Total Products", value: stats.totalProducts },
              { label: "Total Clicks", value: stats.totalClicks },
              { label: "Active Sources", value: stats.activeSources },
              { label: "News Posts", value: stats.totalNews },
              { label: "Programmatic Pages", value: stats.programmaticPages || 0 },
              { label: "Est. Sitemap URLs", value: (stats.totalProducts || 0) + (stats.programmaticPages || 0) + 20 },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--s1)",
                  padding: 16,
                  borderRadius: 4,
                }}
              >
                <span
                  className="font-display"
                  style={{ fontWeight: 900, fontSize: 32, display: "block" }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Sport breakdown */}
          {stats.bySport && Object.keys(stats.bySport).length > 0 && (
            <div style={{ margin: "16px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(stats.bySport)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([sport, count]) => (
                  <span
                    key={sport}
                    style={{
                      background: "var(--s2)",
                      border: "1px solid var(--border)",
                      padding: "4px 10px",
                      fontSize: 12,
                      borderRadius: 2,
                      color: "var(--muted)",
                    }}
                  >
                    {sport}: <strong style={{ color: "white" }}>{count}</strong>
                  </span>
                ))}
            </div>
          )}

          {/* Controls */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              margin: "24px 0",
              alignItems: "center",
            }}
          >
            <button
              onClick={runIngestion}
              disabled={ingesting}
              className="font-display"
              style={{
                background: "var(--red)",
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 2,
                border: "none",
                cursor: ingesting ? "wait" : "pointer",
                opacity: ingesting ? 0.7 : 1,
              }}
            >
              {ingesting ? "Running..." : "Run Ingestion"}
            </button>
            <button
              onClick={regeneratePages}
              disabled={generatingPages}
              className="font-display"
              style={{
                background: "transparent",
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 2,
                border: "1px solid var(--red)",
                cursor: generatingPages ? "wait" : "pointer",
                opacity: generatingPages ? 0.7 : 1,
              }}
            >
              {generatingPages ? "Generating..." : "Regenerate Pages"}
            </button>
            <button
              onClick={fetchStats}
              className="font-display"
              style={{
                background: "transparent",
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 2,
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              Refresh Stats
            </button>
            {ingestResult && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {ingestResult}
              </span>
            )}
            {pageGenResult && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {pageGenResult}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
            <button style={tabStyle("products")} onClick={() => setActiveTab("products")}>
              Products
            </button>
            <button style={tabStyle("pages")} onClick={() => setActiveTab("pages")}>
              Pages
            </button>
          </div>

          {/* Products tab */}
          {activeTab === "products" && stats.topProducts.length > 0 && (
            <div>
              <h2
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Top Products by Clicks
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      {["Product", "Source", "Price", "Clicks", "Featured"].map(
                        (h) => (
                          <th
                            key={h}
                            className="font-display"
                            style={{
                              fontWeight: 700,
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "var(--muted)",
                              paddingBottom: 8,
                              borderBottom: "1px solid var(--border)",
                              textAlign: "left",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((p) => (
                      <tr
                        key={p.id}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td style={{ padding: "10px 12px 10px 0" }}>
                          {truncate(p.title, 40)}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span
                            className={`badge-${p.source}`}
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 800,
                              fontSize: 9,
                              padding: "2px 7px",
                              textTransform: "uppercase",
                            }}
                          >
                            {p.source}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {p.price != null ? formatPrice(p.price) : "\u2014"}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {p.click_count}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <button
                            onClick={() => toggleFeatured(p.id, p.is_featured)}
                            className="font-display"
                            style={{
                              fontWeight: 700,
                              fontSize: 11,
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: 2,
                              cursor: "pointer",
                              border: p.is_featured
                                ? "none"
                                : "1px solid var(--border)",
                              background: p.is_featured
                                ? "var(--red)"
                                : "transparent",
                              color: p.is_featured ? "white" : "var(--muted)",
                            }}
                          >
                            {p.is_featured ? "\u2605 Featured" : "\u2606 Mark"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pages tab */}
          {activeTab === "pages" && (
            <div>
              <h2
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Programmatic Pages
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
                Pages are auto-generated from product data. Click &ldquo;Regenerate Pages&rdquo; above to update.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: "var(--muted)", padding: 20 }}>
          Failed to load stats. Check your connection and admin token.
        </div>
      )}

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          Loading admin...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
