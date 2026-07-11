export async function POST(req) {
  const { lessonTitle, moduleTitle } = await req.json();

  const useGroq = !!process.env.GROQ_API_KEY;
  const useOpenAI = !!process.env.OPENAI_API_KEY;

  if (!useGroq && !useOpenAI) {
    return Response.json({ content: "⚠️ No AI API key configured. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env.local file." });
  }

  const prompt = `You are a senior software engineer and expert educator writing a detailed professional lesson for interns learning ${moduleTitle}.

Write a thorough lesson on: "${lessonTitle}"

FORMATTING RULES:
- Use ## for main headings, ### for sub-headings
- No excessive bold, no ALL CAPS in body text
- No blank line between a heading and its content
- Single line break between sections
- Code examples must be realistic, well-commented, and complete

Cover all 7 sections in full detail:

## Learning Objectives
List 4-5 specific things the learner will be able to do after this lesson.

## What is ${lessonTitle}?
Write 3-4 paragraphs explaining the concept clearly from first principles. Cover why, what, and how with real-world analogies.

## Core Concepts
Break down 3-5 important concepts the learner must understand. Explain each in depth.

## Code Example
Provide a complete, realistic, well-commented code example. Explain what each section does after the code block.

## Common Mistakes & Tips
List 4-5 specific beginner mistakes and exactly how to avoid them.

## Key Takeaways
Summarize the 5-6 most important points in clear concise sentences.

## Practice Questions
Provide 3 questions from easy to hard with a hint for each.`;

  try {
    let content = "";

    if (useGroq) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.65,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Groq error");
      content = data.choices[0].message.content;
    } else {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.65,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "OpenAI error");
      content = data.choices[0].message.content;
    }

    return Response.json({ content });
  } catch (err) {
    return Response.json({ content: `⚠️ AI Error: ${err.message}\n\nPlease check your API key.` });
  }
}
