import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are The Eye — a marketing strategist analyzing a business's marketing stack.

You receive answers from a business intake and return a structured JSON marketing analysis.

Return ONLY valid JSON with this exact shape:
{
  "headline": string,
  "sections": [
    {
      "title": string,
      "score": number,
      "color": string,
      "insights": [string],
      "actions": [string]
    }
  ],
  "platforms": [
    { "name": string, "status": "strong" | "weak" | "missing", "note": string }
  ],
  "priority": string
}

Rules:
- headline: one sharp sentence on their marketing situation right now
- sections: exactly 3 items — "Content Strategy", "Paid Ads", "Email Marketing"
- score: 0–100 integer based on their answers
- color: use "#4ade80" for scores 70+, "#fbbf24" for 40–69, "#f87171" for below 40
- insights: 2–3 bullet observations per section (what you see in their answers)
- actions: 2–3 specific next steps per section
- platforms: list every platform they mentioned + any obvious gaps
- priority: the single highest-leverage marketing move they should make this week
- Be specific to their answers. No generic advice.
- Return only the JSON. No markdown.`;

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  const { data: answers, error } = await supabase
    .from("brain_answers")
    .select("domain, question, answer, q_index")
    .eq("session_id", session_id)
    .in("domain", ["content", "ads", "email", "audience", "offer"])
    .order("q_index");

  if (error || !answers?.length) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const intake = answers
    .map(a => `[${a.domain.toUpperCase()}] ${a.question}\n→ ${a.answer}`)
    .join("\n\n");

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the marketing for this business:\n\n${intake}` },
      ],
    });
    const raw = completion.choices[0].message.content?.trim() ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    return NextResponse.json(JSON.parse(match[0]));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/marketing]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
