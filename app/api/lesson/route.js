import { rateLimit, validateLessonInput, getClientIp } from "@/lib/security";
import { verifyAuth } from "@/lib/auth-verify";

export const runtime = "nodejs";

export async function POST(req) {
  // ── 1. Must be logged in ──
  const { authenticated, uid } = await verifyAuth(req);
  if (!authenticated) {
    return Response.json({ content: "⚠️ Please log in to access lessons." }, { status: 401 });
  }

  // ── 2. CSRF ──
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && !origin.includes(host)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── 3. Rate limit per user ──
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`lesson-${uid}-${ip}`, 5, 60000);
  if (!allowed) {
    return Response.json({ content: "⚠️ Too many requests. Wait a minute." }, { status: 429 });
  }

  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { valid, error } = validateLessonInput(body);
  if (!valid) return Response.json({ content: `⚠️ ${error}` }, { status: 400 });

  const { lessonTitle, moduleTitle } = body;
  const useGroq = !!process.env.GROQ_API_KEY;
  const useOpenAI = !!process.env.OPENAI_API_KEY;
  if (!useGroq && !useOpenAI) {
    return Response.json({ content: "⚠️ AI not configured." }, { status: 503 });
  }

  const prompt = `You are an expert educator at Internee.pk. Generate a detailed lesson on: "${lessonTitle}" for module: "${moduleTitle}".

Use ## for headings, ### for sub-headings. Cover:
## Learning Objectives
## What is ${lessonTitle}?
## Core Concepts
## Code Example
## Common Mistakes and Tips
## Key Takeaways
## Practice Questions`;

  try {
    let content = "";
    if (useGroq) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], max_tokens: 3000, temperature: 0.65 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Groq error");
      content = data.choices[0].message.content;
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], max_tokens: 3000, temperature: 0.65 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("OpenAI error");
      content = data.choices[0].message.content;
    }
    return Response.json({ content });
  } catch {
    return Response.json({ content: "⚠️ AI temporarily unavailable." }, { status: 503 });
  }
}
