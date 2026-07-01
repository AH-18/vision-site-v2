"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle, ArrowRight, Eye, Zap, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ─── SCANNING STATUS CYCLE ─── */
const SCAN_STATES = [
  "ANALYZING BRAND DNA...",
  "READING MARKET SIGNALS...",
  "COMPARING PAST CAMPAIGNS...",
  "SCANNING COMPETITORS...",
  "CROSS-REFERENCING AUDIENCE...",
  "3 SIGNALS DETECTED.",
];

/* ─── DEFAULT DATA (shown before Brain is completed) ─── */
const DEFAULT_METRICS = [
  { label: "Business Health", value: 91, color: "var(--green)" },
  { label: "Brand Position",  value: 92, color: "var(--gold)" },
  { label: "Content Engine",  value: 76, color: "var(--amber)" },
  { label: "Sales Readiness", value: 83, color: "var(--blue)" },
];

const DEFAULT_OPPORTUNITIES = [
  { id: "01", title: "Increase educational content", body: "Competitors increased posting 40% this month. Closing the gap generates +14% organic reach.", impact: "+14% reach" },
  { id: "02", title: "Refine offer positioning", body: "Last 3 hooks led with features not outcomes. Outcome-first language shows 2.1× conversion lift.", impact: "+2.1× conversion" },
  { id: "03", title: "Launch referral loop", body: "No referral system exists. Brands at your stage with one acquire 22% of clients at zero cost.", impact: "+22% CAC reduction" },
];

const DEFAULT_RISKS = [
  { id: "01", title: "Posting consistency down 60%", body: "Dropped from 5× to 2× per week. Audience attention window closes in 4 days.", severity: "CRITICAL" },
  { id: "02", title: "Trust domain score at 68", body: "Lowest of all 10 domains. No testimonials or case studies visible on landing page.", severity: "HIGH" },
];

/* ─── EYE COMPONENT ─── */
function TheEye({ scanState }: { scanState: string }) {
  return (
    <div style={{ position: "relative", width: "380px", height: "380px", flexShrink: 0 }}>

      {/* Wide atmosphere bloom */}
      <div style={{
        position: "absolute", inset: "-100px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 65%)",
        filter: "blur(20px)", animation: "neonBreath 6s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Tight core bloom */}
      <div style={{
        position: "absolute", inset: "-40px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)",
        filter: "blur(8px)", animation: "neonBreath 6s ease-in-out infinite 1s", pointerEvents: "none",
      }} />

      {/* Pulsing glow ring */}
      <div style={{
        position: "absolute", inset: "-3px", borderRadius: "50%",
        boxShadow: "0 0 20px 4px rgba(255,255,255,0.2), 0 0 60px 12px rgba(255,255,255,0.1), 0 0 120px 24px rgba(255,255,255,0.05)",
        animation: "neonPulse 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Circle border */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.55)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 30px rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.04)",
      }} />

      {/* Interior — black void */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#060606" }}>

        {/* Iris fiber lines — 16 radial */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: "50%", height: "1px", transformOrigin: "0 50%",
            transform: `rotate(${i * 22.5}deg)`,
            background: `linear-gradient(to right, transparent, rgba(255,255,255,${0.025 + (i % 3) * 0.012}))`,
          }} />
        ))}

        {/* Concentric rings */}
        {[130, 100, 72, 46].map((size, i) => (
          <div key={size} style={{
            position: "absolute", top: "50%", left: "50%",
            width: size, height: size, borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${0.07 + i * 0.04})`,
            transform: "translate(-50%,-50%)",
            animation: `ringBreath ${3 + i * 0.7}s ease-in-out infinite ${i * 0.4}s`,
          }} />
        ))}

        {/* Horizontal scan sweep */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "1px", top: "50%",
          background: "linear-gradient(to right, transparent 5%, rgba(255,255,255,0.55) 50%, transparent 95%)",
          animation: "innerScanH 3s ease-in-out infinite",
        }} />

        {/* Vertical scan sweep */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: "1px", left: "50%",
          background: "linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.55) 50%, transparent 95%)",
          animation: "innerScan 2.2s ease-in-out infinite 0.6s",
        }} />

        {/* Corner crosshair brackets */}
        {([
          { top: "18%", left: "18%", borderTop: "1.5px solid rgba(255,255,255,0.5)", borderLeft: "1.5px solid rgba(255,255,255,0.5)" },
          { top: "18%", right: "18%", borderTop: "1.5px solid rgba(255,255,255,0.5)", borderRight: "1.5px solid rgba(255,255,255,0.5)" },
          { bottom: "18%", left: "18%", borderBottom: "1.5px solid rgba(255,255,255,0.5)", borderLeft: "1.5px solid rgba(255,255,255,0.5)" },
          { bottom: "18%", right: "18%", borderBottom: "1.5px solid rgba(255,255,255,0.5)", borderRight: "1.5px solid rgba(255,255,255,0.5)" },
        ] as React.CSSProperties[]).map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 18, height: 18, ...s }} />
        ))}

        {/* Pupil */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 18, height: 18, borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, #fff 30%, rgba(255,255,255,0.6) 70%, transparent 100%)",
          boxShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5), 0 0 70px rgba(255,255,255,0.2)",
          animation: "pupilPulse 3.5s ease-in-out infinite",
        }} />

        {/* Pupil outer ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 40, height: 40, borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          border: "1px solid rgba(255,255,255,0.3)",
          animation: "ringBreath 3.5s ease-in-out infinite 0.5s",
        }} />
      </div>

      {/* Scan status */}
      <div style={{
        position: "absolute", bottom: "-52px", left: "50%", transform: "translateX(-50%)",
        whiteSpace: "nowrap", fontFamily: "var(--font-space-mono)",
        fontSize: "11px", letterSpacing: "0.2em", color: "rgba(215,190,105,0.8)", textAlign: "center",
      }}>
        {scanState}<span style={{ animation: "blink 1s step-end infinite" }}>_</span>
      </div>
    </div>
  );
}

/* ─── HUD BOX ─── */
function HudBox({ label, value, color, glitchDelay = "0s", barDelay = 0 }: {
  label: string; value: number; color: string; glitchDelay?: string; barDelay?: number;
}) {
  const segments = 20;
  const filled = Math.round((value / 100) * segments);
  return (
    <div style={{ position: "relative", background: "#080808", border: `1px solid ${color}33`, overflow: "hidden", padding: "18px 20px 16px" }}>
      {/* Scanlines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px)" }} />
      {/* Pixel dot grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "7px 7px" }} />
      {/* Top color bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: color, opacity: 0.8 }} />
      {/* Bottom color trace */}
      <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: "1px", background: color, opacity: 0.3 }} />

      {/* Glitching number */}
      <div style={{ position: "relative", zIndex: 3, fontFamily: "var(--font-bebas)", fontSize: "58px", color, lineHeight: 1, letterSpacing: "0.04em", animation: `glitch 5s ${glitchDelay} step-end infinite` }}>
        {value}
        <span aria-hidden style={{ position: "absolute", inset: 0, color: "#f87171", opacity: 0, animation: `glitchR 5s ${glitchDelay} step-end infinite`, transform: "translateX(3px)", mixBlendMode: "screen" }}>{value}</span>
        <span aria-hidden style={{ position: "absolute", inset: 0, color: "#60a5fa", opacity: 0, animation: `glitchB 5s ${glitchDelay} step-end infinite`, transform: "translateX(-3px)", mixBlendMode: "screen" }}>{value}</span>
      </div>

      {/* Label */}
      <div style={{ position: "relative", zIndex: 3, fontFamily: "var(--font-space-mono)", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-2)", marginTop: "6px" }}>{label}</div>

      {/* Segmented pixel bar */}
      <div style={{ display: "flex", gap: "2px", marginTop: "12px", position: "relative", zIndex: 3 }}>
        {Array.from({ length: segments }, (_, i) => (
          <div key={i} style={{
            flex: 1, height: "6px",
            background: i < filled ? color : "rgba(255,255,255,0.05)",
            boxShadow: i < filled && i === filled - 1 ? `0 0 6px ${color}, 0 0 12px ${color}66` : "none",
            animation: i < filled ? `segAppear 0.04s ${barDelay + i * 0.035}s both` : "none",
            opacity: i < filled ? 0 : 0.5,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function DashboardPage() {
  const [scanIdx, setScanIdx]         = useState(0);
  const [outputVisible, setOutputVisible] = useState(false);
  const [aiLoading, setAiLoading]     = useState(false);
  const [metrics, setMetrics]         = useState(DEFAULT_METRICS);
  const [opportunities, setOpportunities] = useState(DEFAULT_OPPORTUNITIES);
  const [risks, setRisks]             = useState(DEFAULT_RISKS);
  const [headline, setHeadline]       = useState("");

  /* Scan cycle */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScanIdx(i % SCAN_STATES.length);
      if (i >= SCAN_STATES.length - 1) {
        setOutputVisible(true);
        clearInterval(interval);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  /* Load AI insights from latest Brain session */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: session, error: sessionErr } = await supabase
        .from("brain_sessions")
        .select("id")
        .eq("completed", true)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (sessionErr || !session) return;
      setAiLoading(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: session.id }),
        });
        const data = await res.json();
        if (data.error) { console.error("[Eye] analyze error:", data.error); return; }
        if (data.metrics?.length)       setMetrics(data.metrics.map((m: { label: string; value: string; color: string }) => ({ label: m.label, value: parseInt(String(m.value)), color: m.color })));
        if (data.opportunities?.length) setOpportunities(data.opportunities.map((o: { title: string; impact: string; action: string }, i: number) => ({ id: String(i+1).padStart(2,"0"), title: o.title, body: o.action, impact: o.impact })));
        if (data.risks?.length)         setRisks(data.risks.map((r: { title: string; severity: string; action: string }, i: number) => ({ id: String(i+1).padStart(2,"0"), title: r.title, body: r.action, severity: r.severity })));
        if (data.headline)              setHeadline(data.headline);
      } catch (e) {
        console.error("[Eye] fetch error:", e);
      } finally {
        setAiLoading(false);
      }
    })();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        @keyframes neonBreath {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.05); }
        }
        @keyframes neonPulse {
          0%,100% { box-shadow:0 0 20px 4px rgba(255,255,255,0.2), 0 0 60px 12px rgba(255,255,255,0.1), 0 0 120px 24px rgba(255,255,255,0.05); }
          50%      { box-shadow:0 0 32px 6px rgba(255,255,255,0.32), 0 0 90px 18px rgba(255,255,255,0.16), 0 0 170px 36px rgba(255,255,255,0.08); }
        }
        @keyframes ringBreath {
          0%,100% { opacity:0.35; }
          50%      { opacity:1; }
        }
        @keyframes innerScan {
          0%,100% { opacity:0; transform:scaleY(0.2) translateX(-50%); }
          30%,70% { opacity:1; transform:scaleY(1) translateX(-50%); }
          50%      { opacity:0.5; }
        }
        @keyframes innerScanH {
          0%,100% { opacity:0; transform:scaleX(0.2) translateY(-50%); }
          30%,70% { opacity:1; transform:scaleX(1) translateY(-50%); }
          50%      { opacity:0.5; }
        }
        @keyframes pupilPulse {
          0%,100% { box-shadow:0 0 10px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5), 0 0 70px rgba(255,255,255,0.15); transform:translate(-50%,-50%) scale(1); }
          50%      { box-shadow:0 0 16px rgba(255,255,255,1), 0 0 50px rgba(255,255,255,0.7), 0 0 100px rgba(255,255,255,0.25); transform:translate(-50%,-50%) scale(1.25); }
        }
        @keyframes glitch {
          0%,78%,100% { transform:none; }
          79% { transform:translateX(-4px) skewX(-3deg); }
          80% { transform:translateX(4px) skewX(2deg); }
          81% { transform:translateX(-2px); }
          82% { transform:none; }
          91% { transform:translateX(3px); }
          92% { transform:none; }
        }
        @keyframes glitchR {
          0%,78%,100% { opacity:0; }
          79%,80% { opacity:0.55; }
          81% { opacity:0; }
          91%,92% { opacity:0.3; }
          93% { opacity:0; }
        }
        @keyframes glitchB {
          0%,79%,100% { opacity:0; }
          80%,81% { opacity:0.55; }
          82% { opacity:0; }
          90%,91% { opacity:0.3; }
          92% { opacity:0; }
        }
        @keyframes segAppear {
          from { opacity:0; transform:scaleY(0.2); }
          to   { opacity:1; transform:scaleY(1); }
        }
        @keyframes hudPing {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.3; transform:scale(0.6); }
        }
        @keyframes blink {
          0%,100%{opacity:1} 50%{opacity:0}
        }
        @keyframes scanLine {
          0%   { transform:translateY(-100%); opacity:0; }
          10%  { opacity:0.15; }
          90%  { opacity:0.15; }
          100% { transform:translateY(100vh); opacity:0; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

        {/* Background texture — founder photo faded */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/two.png" alt="" aria-hidden style={{
          position: "absolute", right: "-5%", top: 0, height: "100vh", width: "55%",
          objectFit: "cover", objectPosition: "center top",
          opacity: 0.15,
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.15) 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.15) 60%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Scan line sweep */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "2px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
          animation: "scanLine 8s linear infinite",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ── HEADER ── */}
        <div style={{ position: "relative", zIndex: 1, padding: "40px 56px 0" }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>
                The Eye · Active Scan
              </span>
              <span style={{ width: "32px", height: "1px", background: "var(--border-2)" }} />
              <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-3)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(48px, 5vw, 72px)",
              letterSpacing: "0.04em",
              color: "var(--text)",
              lineHeight: 0.95,
            }}>
              {greeting}, Sabbah.
            </h1>
            {headline && (
              <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "12px", letterSpacing: "0.12em", color: "var(--gold)", marginTop: "10px", opacity: 0.85 }}>
                ◈ {headline}
              </p>
            )}
          </motion.div>
        </div>

        {/* ── EYE HERO SECTION ── */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 56px 80px",
          gap: "0",
        }}>

          {/* Left — quick metrics */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", maxWidth: "220px", marginRight: "60px" }}>
            {metrics.slice(0, 2).map(({ label, value, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <HudBox label={label} value={value} color={color} glitchDelay={`${i * 0.8}s`} barDelay={0.4 + i * 0.15} />
              </motion.div>
            ))}
          </div>

          {/* Center — The Eye */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}
          >
            <TheEye scanState={SCAN_STATES[scanIdx]} />
          </motion.div>

          {/* Right — quick metrics */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", maxWidth: "220px", marginLeft: "60px" }}>
            {metrics.slice(2, 4).map(({ label, value, color }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <HudBox label={label} value={value} color={color} glitchDelay={`${0.4 + i * 0.8}s`} barDelay={0.5 + i * 0.15} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── OUTPUTS ── */}
        {outputVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", zIndex: 1, padding: "0 56px 56px" }}
          >
            {/* Divider line */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--border))" }} />
              <span style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: "0.25em", color: "var(--text-3)" }}>
                EYE OUTPUT
              </span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, var(--border))" }} />
            </div>

            <div className="opp-risks-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

              {/* OPPORTUNITIES */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <Zap size={16} color="var(--green)" strokeWidth={2.2} />
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", letterSpacing: "0.18em", color: "var(--green)" }}>
                    {aiLoading ? "ANALYZING..." : `${opportunities.length} OPPORTUNITIES DETECTED`}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {opportunities.map(({ id, title, body, impact }, i) => (
                    <motion.div key={id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.4 }}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderLeft: "3px solid var(--green)",
                        borderRadius: "12px",
                        padding: "20px 22px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "rgba(74,222,128,0.2)", lineHeight: 1 }}>{id}</span>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "13px", fontWeight: 700, color: "var(--green)", letterSpacing: "0.1em", background: "var(--green-dim)", padding: "3px 8px", border: "1px solid rgba(74,222,128,0.3)" }}>{impact}</span>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>{title}</div>
                      <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.6 }}>{body}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px" }}>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "12px", letterSpacing: "0.15em", color: "var(--green)", fontWeight: 700 }}>APPLY RECOMMENDATION</span>
                        <ArrowRight size={12} color="var(--green)" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RISKS */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <ShieldAlert size={16} color="var(--red)" strokeWidth={2.2} />
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", letterSpacing: "0.18em", color: "var(--red)" }}>
                    {aiLoading ? "ANALYZING..." : `${risks.length} RISKS DETECTED`}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {risks.map(({ id, title, body, severity }, i) => (
                    <motion.div key={id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.4 }}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderLeft: "3px solid var(--red)",
                        borderRadius: "12px",
                        padding: "20px 22px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <span style={{ fontFamily: "var(--font-bebas)", fontSize: "32px", color: "rgba(248,113,113,0.2)", lineHeight: 1 }}>{id}</span>
                        <span style={{
                          fontFamily: "var(--font-space-mono)", fontSize: "10px", fontWeight: 700,
                          color: "var(--red)", background: "var(--red-dim)",
                          padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.12em",
                        }}>{severity}</span>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>{title}</div>
                      <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.6 }}>{body}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px" }}>
                        <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "12px", letterSpacing: "0.15em", color: "var(--red)", fontWeight: 700 }}>RESOLVE NOW</span>
                        <ArrowRight size={12} color="var(--red)" />
                      </div>
                    </motion.div>
                  ))}

                  {/* Eye observation */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderTop: "3px solid var(--gold)",
                      borderRadius: "12px",
                      padding: "20px 22px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Eye size={13} color="var(--gold)" strokeWidth={2.2} />
                      <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700 }}>
                        The Eye Notes
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7, fontStyle: "italic" }}>
                      &ldquo;Six months in, your audience responds to simplicity over luxury. Your early campaigns said premium. The data says something else. Worth a positioning conversation.&rdquo;
                    </p>
                  </motion.div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
