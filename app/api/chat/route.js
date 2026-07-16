import { rateLimit, sanitizePrompt, validateChatInput, getClientIp, detectAbuse } from "@/lib/security";
import { verifyAuth } from "@/lib/auth-verify";

export const runtime = "nodejs";

export async function POST(req) {
  const { authenticated, uid } = await verifyAuth(req);
  if (!authenticated) {
    return Response.json({ reply: "Please log in to use the AI tutor.", isWeakArea: false }, { status: 401 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && !origin.includes(host)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const { allowed } = rateLimit(`${uid}-${ip}`, 10, 60000);
  if (!allowed) {
    return Response.json(
      { reply: "Too many requests. Please wait a minute.", isWeakArea: false },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { valid, error } = validateChatInput(body);
  if (!valid) return Response.json({ error }, { status: 400 });

  const { messages, context } = body;

  const lastMessage = messages[messages.length - 1]?.content || "";
  if (detectAbuse(lastMessage)) {
    return Response.json({ reply: "Your message contains invalid content. Please try again.", isWeakArea: false });
  }

  // FIX: Only send last 10 messages to API to prevent token overflow
  // Keep full history in UI but only send recent context to AI
  const recentMessages = messages.slice(-10);

  const sanitizedMessages = recentMessages.map(m => ({
    role: m.role,
    // FIX: Truncate each message to 1500 chars to prevent token overflow
    content: m.role === "user"
      ? sanitizePrompt(m.content).slice(0, 1500)
      : m.content.slice(0, 1500),
  }));

  const useGroq = !!process.env.GROQ_API_KEY;
  const useOpenAI = !!process.env.OPENAI_API_KEY;
  if (!useGroq && !useOpenAI) {
    return Response.json({ reply: "AI service not configured.", isWeakArea: false }, { status: 503 });
  }

  const systemPrompt = `You are a helpful AI tutor for Internee.pk helping students learn ${context.moduleTitle}.

The student is currently studying: "${context.lessonTitle}"
Lesson context: ${context.lessonContent?.slice(0, 400) || "Not provided"}

Your job:
- Answer any question related to ${context.moduleTitle} or ${context.lessonTitle} clearly and helpfully
- Give practical examples and code snippets when relevant
- If a student seems confused or asks the same concept repeatedly, set isWeakArea to true
- Be encouraging and supportive

Respond ONLY in this exact JSON format:
{ "reply": "your detailed markdown answer here", "isWeakArea": false }`;

  try {
    let data;
    if (useGroq) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, ...sanitizedMessages],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Groq error");
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }, ...sanitizedMessages],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "OpenAI error");
    }

    let result = { reply: "", isWeakArea: false };
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch {
      result.reply = data.choices[0].message.content;
    }
    return Response.json(result);

  } catch (err) {
    return Response.json({ reply: "AI temporarily unavailable. Please try again.", isWeakArea: false }, { status: 503 });
  }
}
