"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DOMAINS = [
  { id: "identity", label: "Identity",  icon: "◈", color: "#D7BE69", questions: ["What is your brand name and what do you do — one sentence.", "What makes you different from every competitor in your space?", "If your brand were a person, describe their personality in 3 words."] },
  { id: "audience", label: "Audience",  icon: "◉", color: "#4ade80", questions: ["Describe your ideal client — age, job title, situation.", "What is their single biggest pain point that keeps them up at night?", "Where do they spend time online? (platforms, communities, media)"] },
  { id: "offer",    label: "Offer",     icon: "◆", color: "#60a5fa", questions: ["What is your core offer and what does it cost?", "What specific result or transformation does it deliver to the client?"] },
  { id: "sales",    label: "Sales",     icon: "◇", color: "#f87171", questions: ["How do clients currently find you and what does your sales process look like?", "What is your current monthly revenue or number of active clients?"] },
  { id: "content",  label: "Content",   icon: "▣", color: "#a78bfa", questions: ["What platforms are you active on and how often do you post per week?", "What type of content has performed best for you so far?"] },
  { id: "ads",      label: "Ads",       icon: "▲", color: "#fb923c", questions: ["Are you running paid ads? If yes — which platforms and what is the monthly budget?"] },
  { id: "email",    label: "Email",     icon: "▤", color: "#34d399", questions: ["Do you have an email list? How many subscribers and what is your average open rate?"] },
  { id: "growth",   label: "Growth",    icon: "△", color: "#D7BE69", questions: ["What is your #1 business goal for the next 90 days — be specific.", "What is the single biggest bottleneck stopping you from reaching it?"] },
  { id: "threats",  label: "Threats",   icon: "◬", color: "#f87171", questions: ["Name your top 3 competitors and what they do better than you right now."] },
  { id: "trust",    label: "Trust",     icon: "◎", color: "#60a5fa", questions: ["Do you have testimonials or case studies? How many and where are they shown?", "What is your trust score — reviews, domain authority, press mentions?"] },
];

const ALL_Q = DOMAINS.flatMap((d, di) => d.questions.map(q => ({ question: q, domainIdx: di })));

export default function BrainPage() {
  const [messages, setMessages]   = useState([{ role: "eye", text: ALL_Q[0].question, qIdx: 0 }]);
  const [input, setInput]         = useState("");
  const [currentQ, setCurrentQ]   = useState(0);
  const [thinking, setThinking]   = useState(false);
  const [complete, setComplete]   = useState(false);
  const [answers, setAnswers]     = useState({});
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  const domainStatus = DOMAINS.map((d, di) => {
    const qs = ALL_Q.map((q, i) => ({ ...q, i })).filter(q => q.domainIdx === di);
    const done = qs.every(q => answers[q.i] !== undefined);
    const any  = qs.some(q => answers[q.i] !== undefined);
    return done ? "done" : any ? "active" : "pending";
  });

  const activeDomain = complete ? DOMAINS.length - 1 : (ALL_Q[currentQ]?.domainIdx ?? 0);

  async function submit() {
    const v = input.trim();
    if (!v || thinking || complete) return;
    const newAnswers = { ...answers, [currentQ]: v };
    setAnswers(newAnswers);
    setMessages(m => [...m, { role: "user", text: v }]);
    setInput("");
    setThinking(true);
    const next = currentQ + 1;
    const currentDomain = DOMAINS[ALL_Q[currentQ].domainIdx];

    try {
      // Get AI acknowledgment of this answer
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: ALL_Q[currentQ].question,
          answer: v,
          domain: currentDomain.label,
        }),
      });
      const { text: ackText, valid } = res.ok ? await res.json() : { text: "Give me a real answer.", valid: false };

      setThinking(false);

      // Invalid answer — push back, stay on same question
      if (!valid) {
        setAnswers(a => { const copy = { ...a }; delete copy[currentQ]; return copy; });
        setMessages(m => [...m, { role: "eye", text: ackText }]);
        return;
      }

      if (next >= ALL_Q.length) {
        setComplete(true);
        setMessages(m => [...m,
          { role: "eye", text: ackText },
          { role: "eye", text: "The Brain is fully loaded. I now know your business across all 10 domains. Return to the Overview — The Eye will begin generating insights." },
        ]);
        // Save session + all answers to Supabase
        (async () => {
          const { data: session, error: sessionErr } = await supabase
            .from("brain_sessions")
            .insert({ completed: true })
            .select("id")
            .single();
          if (sessionErr || !session) return;
          const rows = ALL_Q.map((q, i) => ({
            session_id: session.id,
            domain:     DOMAINS[q.domainIdx].id,
            question:   q.question,
            answer:     newAnswers[i] ?? "",
            q_index:    i,
          }));
          await supabase.from("brain_answers").insert(rows);
        })();
      } else {
        setCurrentQ(next);
        setMessages(m => [...m,
          { role: "eye", text: ackText },
          { role: "eye", text: ALL_Q[next].question, qIdx: next },
        ]);
      }
    } catch {
      setThinking(false);
      setCurrentQ(next < ALL_Q.length ? next : currentQ);
      if (next >= ALL_Q.length) {
        setComplete(true);
        setMessages(m => [...m, { role: "eye", text: "The Brain is fully loaded. Return to the Overview." }]);
      } else {
        setMessages(m => [...m, { role: "eye", text: ALL_Q[next].question, qIdx: next }]);
      }
    }
  }

  const progress = Math.round((Object.keys(answers).length / ALL_Q.length) * 100);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <style>{`
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes dotBounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
      `}</style>

      {/* LEFT — DOMAIN TRACKER */}
      <div style={{ width:240, flexShrink:0, borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", padding:"32px 0", background:"#0a0a0a" }}>
        <div style={{ padding:"0 24px 24px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ fontFamily:"var(--font-space-mono)", fontSize:"9px", letterSpacing:"0.25em", color:"var(--text-3)", marginBottom:6 }}>THE BRAIN</div>
          <div style={{ fontFamily:"var(--font-bebas)", fontSize:"22px", color:"var(--gold)", letterSpacing:"0.1em" }}>DOMAIN INTAKE</div>
          <div style={{ marginTop:12, height:2, background:"var(--border)", overflow:"hidden" }}>
            <motion.div style={{ height:"100%", background:"var(--gold)", transformOrigin:"left" }} initial={{ scaleX:0 }} animate={{ scaleX: progress/100 }} transition={{ duration:0.5 }} />
          </div>
          <div style={{ fontFamily:"var(--font-space-mono)", fontSize:"9px", color:"var(--text-3)", marginTop:6 }}>{progress}% COMPLETE</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 0" }}>
          {DOMAINS.map((d, i) => {
            const st = domainStatus[i];
            const active = i === activeDomain && !complete;
            return (
              <div key={d.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 24px", background: active ? "rgba(215,190,105,0.06)" : "transparent", borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent", transition:"all 0.3s" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background: st==="done" ? d.color : "transparent", border:`1px solid ${st==="pending" ? "var(--border-2)" : d.color}`, fontSize:10, color: st==="done" ? "#000" : d.color, transition:"all 0.4s" }}>
                  {st === "done" ? <Check size={11} strokeWidth={3} /> : d.icon}
                </div>
                <span style={{ fontFamily:"var(--font-space-mono)", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color: st==="done" ? "var(--text-2)" : active ? "var(--gold)" : "var(--text-3)", transition:"color 0.3s" }}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN — CONVERSATION */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"24px 48px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background: complete ? "var(--green)" : thinking ? "var(--amber)" : "var(--gold)", boxShadow:`0 0 8px ${complete ? "var(--green)" : thinking ? "var(--amber)" : "var(--gold)"}`, animation: !complete ? "ping 2s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily:"var(--font-space-mono)", fontSize:11, letterSpacing:"0.2em", color:"var(--gold)" }}>THE EYE · BRAIN INTAKE</span>
          <span style={{ width:24, height:1, background:"var(--border-2)" }} />
          <span style={{ fontFamily:"var(--font-space-mono)", fontSize:11, color:"var(--text-3)" }}>{complete ? "COMPLETE" : `${DOMAINS[activeDomain]?.label?.toUpperCase()} DOMAIN`}</span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"40px 48px", display:"flex", flexDirection:"column", gap:28 }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const domainColor = msg.qIdx !== undefined ? DOMAINS[ALL_Q[msg.qIdx].domainIdx]?.color : "var(--gold)";
              const dLabel = msg.qIdx !== undefined ? DOMAINS[ALL_Q[msg.qIdx].domainIdx]?.label : null;
              const qNum = msg.qIdx !== undefined ? ALL_Q.filter(q => q.domainIdx === ALL_Q[msg.qIdx].domainIdx).findIndex(q => q.question === ALL_Q[msg.qIdx].question) + 1 : null;
              return (
                <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border: msg.role==="eye" ? "1px solid rgba(215,190,105,0.4)" : "1px solid var(--border-2)", background: msg.role==="eye" ? "rgba(215,190,105,0.08)" : "var(--surface)", fontFamily:"var(--font-space-mono)", fontSize:9, color: msg.role==="eye" ? "var(--gold)" : "var(--text-3)" }}>
                    {msg.role === "eye" ? "EYE" : "YOU"}
                  </div>
                  <div style={{ flex:1, paddingTop:5 }}>
                    {dLabel && <div style={{ fontFamily:"var(--font-space-mono)", fontSize:9, letterSpacing:"0.2em", color: domainColor, marginBottom:6, textTransform:"uppercase" }}>{dLabel} · Q{qNum}</div>}
                    <p style={{ fontSize: msg.role==="eye" ? 17 : 15, color: msg.role==="eye" ? "var(--text)" : "var(--text-2)", lineHeight:1.65, fontWeight: msg.role==="eye" ? 500 : 400, margin:0 }}>{msg.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {thinking && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(215,190,105,0.4)", background:"rgba(215,190,105,0.08)", fontFamily:"var(--font-space-mono)", fontSize:9, color:"var(--gold)" }}>EYE</div>
              <div style={{ display:"flex", gap:5, paddingTop:5 }}>
                {[0,1,2].map(j => <div key={j} style={{ width:5, height:5, borderRadius:"50%", background:"var(--gold)", animation:`dotBounce 1.2s ${j*0.2}s ease-in-out infinite` }} />)}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        {!complete && (
          <div style={{ flexShrink:0, borderTop:"1px solid var(--border)", padding:"20px 48px", background:"#080808" }}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-end", border:"1px solid var(--border-2)", background:"var(--surface)", padding:"14px 18px" }}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} placeholder="Type your answer..." disabled={thinking} rows={1} style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"var(--text)", fontSize:15, lineHeight:1.6, fontFamily:"inherit", resize:"none", opacity: thinking ? 0.4 : 1 }} />
              <button onClick={submit} disabled={!input.trim() || thinking} style={{ flexShrink:0, width:36, height:36, background: input.trim() && !thinking ? "var(--gold)" : "var(--surface-2)", border:"none", cursor: input.trim() && !thinking ? "pointer" : "default", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}>
                <ArrowRight size={16} color={input.trim() && !thinking ? "#000" : "var(--text-3)"} />
              </button>
            </div>
            <div style={{ fontFamily:"var(--font-space-mono)", fontSize:10, color:"var(--text-3)", marginTop:8, letterSpacing:"0.1em" }}>
              ENTER to submit · SHIFT+ENTER for new line · {ALL_Q.length - currentQ} questions remaining
            </div>
          </div>
        )}

        {complete && (
          <div style={{ flexShrink:0, borderTop:"1px solid var(--border)", padding:"24px 48px", display:"flex", alignItems:"center", gap:20, background:"rgba(74,222,128,0.04)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 10px var(--green)" }} />
            <span style={{ fontFamily:"var(--font-space-mono)", fontSize:11, letterSpacing:"0.15em", color:"var(--green)" }}>BRAIN FULLY LOADED — {ALL_Q.length} ANSWERS STORED</span>
            <a href="/" style={{ marginLeft:"auto", fontFamily:"var(--font-space-mono)", fontSize:11, letterSpacing:"0.15em", color:"var(--gold)", textDecoration:"none", display:"flex", alignItems:"center", gap:6, border:"1px solid var(--gold-border)", padding:"8px 16px" }}>
              VIEW EYE OUTPUT <ArrowRight size={12} color="var(--gold)" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
