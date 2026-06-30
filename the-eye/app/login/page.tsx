"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<"login" | "signup">("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Account created. Check your email to confirm, then log in.");
        setMode("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #111 inset !important; -webkit-text-fill-color: #F0EDE8 !important; }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, letterSpacing: "0.3em", color: "rgba(215,190,105,0.6)", marginBottom: 6 }}>VISION AGENCY</div>
        <div style={{ fontFamily: "var(--font-bebas)", fontSize: 52, letterSpacing: "0.08em", color: "#F0EDE8", lineHeight: 1 }}>THE EYE</div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D7BE69", boxShadow: "0 0 12px #D7BE69", margin: "12px auto 0", animation: "ping 3s ease-in-out infinite" }} />
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420, background: "#111", border: "1px solid rgba(215,190,105,0.2)", padding: "36px 32px" }}>

        {/* Mode toggle */}
        <div style={{ display: "flex", marginBottom: 32, borderBottom: "1px solid #1f1f1f" }}>
          {(["login", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", borderBottom: `2px solid ${mode === m ? "#D7BE69" : "transparent"}`, fontFamily: "var(--font-space-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: mode === m ? "#D7BE69" : "rgba(240,237,232,0.3)", cursor: "pointer", transition: "all 0.2s", marginBottom: -1 }}>
              {m === "login" ? "LOG IN" : "SIGN UP"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,237,232,0.4)", display: "block", marginBottom: 8 }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
              style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", outline: "none", color: "#F0EDE8", fontSize: 15, padding: "12px 14px", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(215,190,105,0.5)"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-space-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,237,232,0.4)", display: "block", marginBottom: 8 }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6}
              style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", outline: "none", color: "#F0EDE8", fontSize: 15, padding: "12px 14px", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(215,190,105,0.5)"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          {error && <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "#f87171", letterSpacing: "0.05em", background: "rgba(248,113,113,0.08)", padding: "10px 12px", border: "1px solid rgba(248,113,113,0.2)" }}>{error}</div>}
          {success && <div style={{ fontFamily: "var(--font-space-mono)", fontSize: 10, color: "#4ade80", letterSpacing: "0.05em", background: "rgba(74,222,128,0.08)", padding: "10px 12px", border: "1px solid rgba(74,222,128,0.2)" }}>{success}</div>}

          <button type="submit" disabled={loading}
            style={{ marginTop: 8, padding: "14px", background: loading ? "#1a1a1a" : "#D7BE69", border: "none", color: loading ? "rgba(240,237,232,0.3)" : "#000", fontFamily: "var(--font-space-mono)", fontSize: 12, letterSpacing: "0.25em", fontWeight: 700, cursor: loading ? "default" : "pointer", transition: "background 0.2s" }}>
            {loading ? "PROCESSING..." : mode === "login" ? "ENTER THE EYE" : "CREATE ACCOUNT"}
          </button>
        </form>
      </div>
    </div>
  );
}
