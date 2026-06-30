import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are The Eye — a competitive intelligence analyst.

You receive answers from a business intake and return a structured JSON competitor analysis.

Return ONLY valid JSON with this exact shape:
{
  "headline": string,
  "competitors": [
    {
      "name": string,
      "threat": "HIGH" | "MEDIUM" | "LOW",
      "strengths": [string],
      "weaknesses": [string],
      "gap": string
    }
  ],
  "positioning": string,
  "advantages": [string],
  "blind_spots": [string]
}

Rules:
- headline: one sharp sentence on the competitive landscape this business is in
- competitors: analyze each competitor mentioned. If none named, infer from context.
- threat: how dangerous this competitor is to the business right now
- strengths: 2 things this competitor does better than the client
- weaknesses: 2 exploitable weaknesses of this competitor
- gap: one specific opportunity the client can take from this competitor RIGHT NOW
- positioning: how the client should position against ALL competitors combined
- advantages: 2–3 genuine advantages the client has over the field
- blind_spots: 2–3 competitive threats the client is probably not seeing
- Be brutally honest. No flattery.
- Return only the JSON. No markdown.`;

export async function POST(req: NextRequest) {
  const { session_id } = await req.json();
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  const { data: answers, error } = await supabase
    .from("brain_answers")
    .select("domain, question, answer, q_index")
    .eq("session_id", session_id)
    .in("domain", ["threats", "identity", "audience", "offer", "trust"])
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
        { role: "user", content: `Analyze competitors for this business:\n\n${intake}` },
      ],
    });
    const raw = completion.choices[0].message.content?.trim() ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    return NextResponse.json(JSON.parse(match[0]));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/competitors]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
