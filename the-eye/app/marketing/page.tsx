"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, Mail, Megaphone } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Platform { name: string; status: "strong" | "weak" | "missing"; note: string; }
interface Section { title: string; score: number; color: string; insights: string[]; actions: string[]; }
interface MarketingData { headline: string; sections: Section[]; platforms: Platform[]; priority: string; }

function ScoreBar({ value, color }: { value: number; color: string }) {
  const segments = 20;
  const filled = Math.round((value / 100) * segments);
  return (
    <div style={{ display: "flex", gap: 2, marginTop: 8 }}>
      {Array.from({ length: segments }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 4, background: i < filled ? color : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Content Strategy": <Zap size={14} />,
  "Paid Ads": <Megaphone size={14} />,
  "Email Marketing": <Mail size={14} />,
};

export default function MarketingPage() {
  const [data, setData]       = useState<MarketingData | null>(null);
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
        const res = await fetch("/api/marketing", {
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
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, letterSpacing: "0.25em", color: "var(--gold)" }}>THE EYE · MARKETING</span>
          <span style={{ width: 32, height: 1, background: "var(--border-2)" }} />
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.1em" }}>
            {loading ? "SCANNING..." : error ? "NO DATA" : "ANALYSIS COMPLETE"}
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(40px,4vw,60px)", letterSpacing: "0.04em", color: "var(--text)", lineHeight: 1 }}>
          MARKETING ANALYSIS
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
          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--text-3)" }}>THE EYE IS ANALYZING YOUR MARKETING</span>
        </div>
      )}

      {/* No session */}
      {!loading && error === "no_session" && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontFamily: "var(--font-bebas)", fontSize: 32, color: "var(--text-3)", letterSpacing: "0.1em", marginBottom: 12 }}>BRAIN NOT LOADED</div>
          <p style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--text-3)", marginBottom: 24 }}>Complete the Brain intake first to unlock marketing analysis.</p>
          <a href="/brain" style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--gold)", border: "1px solid var(--gold-border)", padding: "10px 20px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            GO TO BRAIN <ArrowRight size={12} />
          </a>
        </div>
      )}

      {/* Error */}
      {!loading && error && error !== "no_session" && (
        <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, color: "var(--red)", padding: "20px", border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.05)" }}>
          ANALYSIS ERROR: {error}
        </div>
      )}

      {/* Data */}
      {!loading && data && (
        <AnimatePresence>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Priority callout */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: "rgba(215,190,105,0.06)", border: "1px solid var(--gold-border)", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 8px var(--gold)", marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.25em", color: "var(--gold)", marginBottom: 6 }}>TOP PRIORITY THIS WEEK</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.5 }}>{data.priority}</div>
              </div>
            </motion.div>

            {/* Platform status */}
            {data.platforms?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.25em", color: "var(--text-3)", marginBottom: 16, textTransform: "uppercase" }}>Platform Presence</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {data.platforms.map((p, i) => {
                    const c = p.status === "strong" ? "var(--green)" : p.status === "weak" ? "var(--amber)" : "var(--red)";
                    return (
                      <div key={i} style={{ background: "var(--surface)", border: `1px solid ${c}33`, padding: "12px 16px", minWidth: 160, flex: "1 1 160px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                          <span style={{ fontFamily: "var(--font-space-mono)", fontSize: 11, letterSpacing: "0.12em", color: c, textTransform: "uppercase" }}>{p.name}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{p.note}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Sections */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {data.sections?.map((s, i) => (
                <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  style={{ background: "#080808", border: `1px solid ${s.color}33`, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: s.color }}>
                      {SECTION_ICONS[s.title]}
                      <span style={{ fontFamily: "var(--font-bebas)", fontSize: 18, letterSpacing: "0.1em" }}>{s.title.toUpperCase()}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-bebas)", fontSize: 40, color: s.color, lineHeight: 1 }}>{s.score}</span>
                  </div>
                  <ScoreBar value={s.score} color={s.color} />

                  <div>
                    <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--text-3)", marginBottom: 8 }}>WHAT THE EYE SEES</div>
                    {s.insights?.map((ins, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: s.color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{ins}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--text-3)", marginBottom: 8 }}>ACTIONS</div>
                    {s.actions?.map((act, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: s.color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.55, fontWeight: 500 }}>{act}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
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
