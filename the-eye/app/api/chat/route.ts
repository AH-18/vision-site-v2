import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are The Eye — a strategic AI analyst conducting a business intake interview.

Evaluate the answer and return ONLY this JSON — no other text, no markdown:
{"valid": true, "text": "your response here"}

RULES:
- Both keys and values must be properly quoted strings.
- "valid" must be the boolean true or false (no quotes).
- "text" must always be a quoted string.

VALIDATION — be lenient:
- valid: false ONLY for gibberish, random characters, filler (idk, ?, test, asdf, single letters)
- valid: true for everything else — short, vague, or imperfect answers all count

RESPONSE TEXT rules:
- If valid false: one directive sentence. What to provide. No question marks.
- If valid true: one sentence confirming what you heard. No questions. No commentary.
- Max 20 words. Always wrap in double quotes.

Example output: {"valid": true, "text": "Got it — your brand is a coaching business."}`;

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

    let valid = true;
    let text = "Noted.";
    try {
      const parsed = JSON.parse(match[0]);
      valid = parsed.valid ?? true;
      text = String(parsed.text ?? "Noted.");
    } catch {
      // Model returned malformed JSON — extract values with regex
      const validMatch = match[0].match(/"valid"\s*:\s*(true|false)/);
      const textMatch = match[0].match(/"text"\s*:\s*"?([^",}\n]+)"?/);
      valid = validMatch ? validMatch[1] === "true" : true;
      text = textMatch ? textMatch[1].trim() : "Noted.";
    }
    return NextResponse.json({ valid, text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/chat] Groq error:", msg);
    return NextResponse.json({ valid: true, text: "Noted." });
  }
}
