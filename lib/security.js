const rateLimitMap = new Map();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.start > 300000) rateLimitMap.delete(key);
  }
}, 300000);

export function rateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  if (record.count >= maxRequests) return { allowed: false, remaining: 0 };
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

export function sanitizePrompt(input) {
  if (!input || typeof input !== "string") return "";
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
    /forget\s+(all\s+)?(previous|prior|above)/gi,
    /disregard\s+(all\s+)?(previous|prior|above)/gi,
    /you\s+are\s+now\s+/gi,
    /act\s+as\s+(if\s+you\s+are\s+)?a?\s*(new|different|another)/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi, /<<SYS>>/gi, /<\|im_start\|>/gi,
    /jailbreak/gi, /DAN\s+mode/gi,
    /pretend\s+(you\s+are|to\s+be)/gi,
    /roleplay\s+as/gi,
    /override\s+(your\s+)?(rules|instructions|guidelines)/gi,
  ];
  let sanitized = input;
  for (const p of injectionPatterns) sanitized = sanitized.replace(p, "[removed]");
  return sanitized.slice(0, 1000).trim();
}

export function validateChatInput({ messages, context }) {
  if (!Array.isArray(messages) || messages.length === 0)
    return { valid: false, error: "Invalid messages" };
  if (messages.length > 50)
    return { valid: false, error: "Too many messages" };
  if (!context?.lessonTitle || !context?.moduleTitle)
    return { valid: false, error: "Missing context" };
  for (const m of messages) {
    if (!["user","assistant"].includes(m.role))
      return { valid: false, error: "Invalid message role" };
    if (typeof m.content !== "string" || m.content.length > 2000)
      return { valid: false, error: "Message too long" };
  }
  return { valid: true };
}

const ALLOWED_MODULES = [
  "Python Basics","Machine Learning","Web Development",
  "Data Analysis","Generative AI","Computer Vision","NLP","Data Science"
];

export function validateLessonInput({ lessonTitle, moduleTitle }) {
  if (!lessonTitle || !moduleTitle) return { valid: false, error: "Missing fields" };
  if (lessonTitle.length > 200 || moduleTitle.length > 200)
    return { valid: false, error: "Title too long" };
  if (!ALLOWED_MODULES.includes(moduleTitle))
    return { valid: false, error: "Unknown module" };
  if (/<[^>]*>/.test(lessonTitle)) return { valid: false, error: "Invalid characters" };
  return { valid: true };
}

export function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Detect suspicious patterns in user messages
export function detectAbuse(message) {
  const abusePatterns = [
    /(\bpassword\b|\bsecret\b|\bapi.?key\b|\btoken\b)/gi,
    /(drop\s+table|select\s+\*|union\s+select)/gi, // SQL injection attempt
    /(eval\(|exec\(|__import__)/gi,                 // Code injection
    /(.{0,20}){50,}/,                               // Repetitive pattern (DoS)
  ];
  return abusePatterns.some(p => p.test(message));
}
