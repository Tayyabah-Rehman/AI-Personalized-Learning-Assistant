export const runtime = "nodejs";

// Whitelist of valid lesson key patterns
const LESSON_KEY_PATTERN = /^[a-z0-9-]+\/[a-z0-9-]+-\d+$/;

export async function POST(req) {
  // CSRF check
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && !origin.includes(host)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { token, lessonKey, score } = body;

  // Validate token exists
  if (!token || typeof token !== "string" || token.length > 2000) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  // Validate lessonKey format — prevents Firestore path injection
  if (!lessonKey || !LESSON_KEY_PATTERN.test(lessonKey)) {
    return Response.json({ error: "Invalid lesson key" }, { status: 400 });
  }

  // Validate score
  const safeScore = Math.min(100, Math.max(0, Number(score) || 100));

  try {
    const { getAdminDb, getAdminAuth } = await import("@/lib/firebase-admin");
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    // Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Extra: check token is not expired (Firebase already does this, but explicit)
    if (decoded.exp * 1000 < Date.now()) {
      return Response.json({ error: "Token expired" }, { status: 401 });
    }

    await adminDb.doc(`users/${uid}`).update({
      [`progress.${lessonKey}`]: {
        completedAt: new Date().toISOString(),
        score: safeScore,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    // Don't expose internal error details
    const isAuthError = err.code?.includes("auth");
    return Response.json(
      { error: isAuthError ? "Authentication failed" : "Update failed" },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
