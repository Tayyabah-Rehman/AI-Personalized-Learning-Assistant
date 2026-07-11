export async function POST(req) {
  const { messages, context } = await req.json();

  const useGroq = !!process.env.GROQ_API_KEY;
  const useOpenAI = !!process.env.OPENAI_API_KEY;

  if (!useGroq && !useOpenAI) {
    return Response.json({ reply: "⚠️ No AI API key configured. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env.local file.", isWeakArea: false });
  }

  const systemPrompt = `You are an expert AI tutor helping an intern learn ${context?.moduleTitle || "technology"}.
Current lesson: ${context?.lessonTitle || "General"}.
Lesson summary: ${context?.lessonContent?.slice(0, 400) || "Not loaded yet"}.

Rules:
- Give clear, concise answers for beginners
- Use code examples when helpful (in markdown code blocks)
- Be encouraging and supportive
- If the user seems confused or repeating the same question, set isWeakArea to true
- Always respond in valid JSON: { "reply": "your markdown response here", "isWeakArea": false }`;

  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 800,
    temperature: 0.7,
    response_format: { type: "json_object" },
  };

  try {
    let data;

    if (useGroq) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ ...payload, model: "llama-3.3-70b-versatile" }),
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Groq error");
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ ...payload, model: "gpt-4o-mini" }),
      });
      data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "OpenAI error");
    }

    let result = { reply: "", isWeakArea: false };
    try { result = JSON.parse(data.choices[0].message.content); }
    catch { result.reply = data.choices[0].message.content; }
    return Response.json(result);

  } catch (err) {
    return Response.json({ reply: `⚠️ AI Error: ${err.message}`, isWeakArea: false });
  }
}
