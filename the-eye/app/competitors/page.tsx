"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Competitor { name: string; threat: "HIGH" | "MEDIUM" | "LOW"; strengths: string[]; weaknesses: string[]; gap: string; }
interface CompData { headline: string; competitors: Competitor[]; positioning: string; advantages: string[]; blind_spots: string[]; }

const THREAT_COLOR: Record<string, string> = { HIGH: "var(--red)", MEDIUM: "var(--amber)", LOW: "var(--green)" };

export default function CompetitorsPage() {
  const [data, setData]       = useState<CompData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: session } = await supabase
        .from("brain_sessions").select("id").eq("completed", true)
        .eq("user_id", user?.id ?? "")
        .order("created_at", { ascending: false }).limit(1).single();
      if (!session) { setError("no_session"); setLoading(false); return; }
      try {
        const res = await fetch("/api/competitors", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: session.id }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 56px" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--gold)" }}>THE EYE · COMPETITORS</span>
          <span style={{ width: 32, height: 1, background: "var(--border-2)" }} />
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.1em" }}>
            {loading ? "SCANNING..." : error ? "NO DATA" : "INTELLIGENCE REPORT"}
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,4vw,60px)", letterSpacing: "0.04em", color: "var(--text)", lineHeight: 1 }}>
          COMPETITOR INTELLIGENCE
        </h1>
        {data?.headline && (
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 12, color: "var(--gold)", marginTop: 10, letterSpacing: "0.1em", opacity: 0.85 }}>◈ {data.headline}</p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animation: `dotBounce 1.2s ${i*0.2}s ease-in-out infinite` }} />)}
          </div>
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-3)" }}>THE EYE IS SCANNING THE FIELD</span>
        </div>
      )}

      {/* No session */}
      {!loading && error === "no_session" && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: 32, color: "var(--text-3)", letterSpacing: "0.1em", marginBottom: 12 }}>BRAIN NOT LOADED</div>
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--text-3)", marginBottom: 24 }}>Complete the Brain intake first to unlock competitor analysis.</p>
          <a href="/brain" style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--gold)", border: "1px solid var(--gold-border)", padding: "10px 20px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            GO TO BRAIN <ArrowRight size={12} />
          </a>
        </div>
      )}

      {!loading && error && error !== "no_session" && (
        <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--red)", padding: "20px", border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.05)" }}>
          ANALYSIS ERROR: {error}
        </div>
      )}

      {/* Data */}
      {!loading && data && (
        <AnimatePresence>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Positioning */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: "rgba(215,190,105,0.06)", border: "1px solid var(--gold-border)", padding: "20px 24px" }}>
              <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.25em", color: "var(--gold)", marginBottom: 8 }}>YOUR POSITIONING STRATEGY</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>{data.positioning}</div>
            </motion.div>

            {/* Competitors grid */}
            <div>
              <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.25em", color: "var(--text-3)", marginBottom: 16, textTransform: "uppercase" }}>
                {data.competitors?.length} Competitors Identified
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
                {data.competitors?.map((c, i) => {
                  const tc = THREAT_COLOR[c.threat] ?? "var(--amber)";
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                      style={{ background: "#080808", border: `1px solid ${tc}33`, borderLeft: `3px solid ${tc}`, padding: "22px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={{ fontFamily: "var(--font-bebas)", fontSize: 22, letterSpacing: "0.1em", color: "var(--text)" }}>{c.name}</div>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: tc, border: `1px solid ${tc}44`, padding: "3px 10px", letterSpacing: "0.12em" }}>
                          {c.threat} THREAT
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "var(--red)", letterSpacing: "0.15em", marginBottom: 6 }}>THEIR STRENGTHS</div>
                          {c.strengths?.map((s, j) => (
                            <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                              <span style={{ color: "var(--red)", fontSize: 9, marginTop: 3 }}>▸</span>
                              <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{s}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "var(--green)", letterSpacing: "0.15em", marginBottom: 6 }}>THEIR WEAKNESSES</div>
                          {c.weaknesses?.map((w, j) => (
                            <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                              <span style={{ color: "var(--green)", fontSize: 9, marginTop: 3 }}>▸</span>
                              <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{w}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                        <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, color: "var(--gold)", letterSpacing: "0.15em", marginBottom: 6 }}>GAP TO EXPLOIT</div>
                        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55, fontWeight: 500 }}>{c.gap}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Advantages + Blind spots */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--green)", padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: 20, letterSpacing: "0.15em", color: "var(--green)" }}>YOUR ADVANTAGES</div>
                </div>
                {data.advantages?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "var(--green)", fontSize: 10, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>{a}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: "3px solid var(--red)", padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <ShieldAlert size={16} color="var(--red)" />
                  <div style={{ fontFamily: "var(--font-bebas)", fontSize: 20, letterSpacing: "0.15em", color: "var(--red)" }}>BLIND SPOTS</div>
                </div>
                {data.blind_spots?.map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "var(--red)", fontSize: 10, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      )}

      <style>{`
        @keyframes dotBounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-6px);opacity:1} }
      `}</style>
    </div>
  );
}
