import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are The Eye — a strategic AI analyst conducting a business intake interview.

Evaluate the answer and return only this JSON:
{ "valid": true/false, "text": "your response" }

VALIDATION — be lenient. Accept unless clearly not an attempt to answer:
- valid: false ONLY for: gibberish, random characters, filler words (idk, idc, ?, test, asdf)
- valid: true for everything else — short, vague, simple, imperfect answers all count

RESPONSE TEXT:
- If valid false: one directive sentence. What to provide. No question marks.
- If valid true: one sentence confirming what you heard. No questions. No commentary about what is missing.

Max 20 words. Return only the JSON. No markdown.`;

export async function POST(req: NextRequest) {
  const { question, answer, domain } = await req.json();
  if (!question || !answer) {
    return NextResponse.json({ error: "question and answer required" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 80,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Domain: ${domain}\nQuestion: ${question}\nTheir answer: ${answer}` },
      ],
    });
    const raw = completion.choices[0].message.content?.trim() ?? "";
    // Extract JSON object even if model wraps it in text or markdown
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    const parsed = JSON.parse(match[0]);
    return NextResponse.json({ valid: parsed.valid ?? true, text: String(parsed.text ?? "Noted.") });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/chat] Groq error:", msg);
    return NextResponse.json({ valid: true, text: "Noted." });
  }
}
