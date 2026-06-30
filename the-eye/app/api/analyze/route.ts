import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are The Eye — a brutally honest, strategic AI analyst for Vision Agency clients.
You receive a business intake across 10 domains and return a structured JSON analysis.

Return ONLY valid JSON with this exact shape:
{
  "metrics": [
    { "label": string, "value": string, "color": string, "bar": number }
  ],
  "opportunities": [
    { "title": string, "impact": "HIGH" | "MEDIUM" | "LOW", "action": string }
  ],
  "risks": [
    { "title": string, "severity": "HIGH" | "MEDIUM" | "LOW", "action": string }
  ],
  "headline": string
}

Rules:
- metrics: exactly 4 items. label max 14 chars, value is a number 0–100 (as string), color is one of: "#4ade80", "#f87171", "#60a5fa", "#D7BE69", bar is 0–100 integer
- opportunities: 3–5 items. Be specific and actionable, not generic
- risks: 3–5 items. Be direct about real threats
- headline: one sharp sentence summarizing the brand's biggest strategic move right now
- No markdown, no explanation, only the JSON object`;

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  // Load answers from Supabase
  const { data: answers, error } = await supabase
    .from("brain_answers")
    .select("domain, question, answer, q_index")
    .eq("session_id", session_id)
    .order("q_index");

  if (error || !answers?.length) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Build prompt
  const intake = answers
    .map(a => `[${a.domain.toUpperCase()}] ${a.question}\n→ ${a.answer}`)
    .join("\n\n");

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this business intake:\n\n${intake}` },
      ],
    });
    const raw = completion.choices[0].message.content?.trim() ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const parsed = JSON.parse(match[0]);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/analyze] Groq error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
