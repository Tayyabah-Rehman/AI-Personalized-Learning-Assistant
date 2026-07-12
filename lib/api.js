// Authenticated API client
// Automatically adds Firebase token to every request

import { auth } from "@/lib/firebase";

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  // getIdToken(true) forces refresh if expired
  return await user.getIdToken(true);
}

export async function fetchLesson(lessonTitle, moduleTitle) {
  const token = await getToken();
  const res = await fetch("/api/lesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ lessonTitle, moduleTitle }),
  });
  if (res.status === 401) throw new Error("Please log in again.");
  if (res.status === 429) throw new Error("Too many requests. Please wait.");
  return res.json();
}

export async function fetchChat(messages, context) {
  const token = await getToken();
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, context }),
  });
  if (res.status === 401) throw new Error("Please log in again.");
  if (res.status === 429) throw new Error("Too many requests. Please wait.");
  return res.json();
}
