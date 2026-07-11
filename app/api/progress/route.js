export const runtime = "nodejs";

export async function POST(req) {
  const { getAdminDb, getAdminAuth } = await import("@/lib/firebase-admin");
  const { token, lessonKey, score } = await req.json();

  try {
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    await adminDb.doc(`users/${uid}`).update({
      [`progress.${lessonKey}`]: {
        completedAt: new Date().toISOString(),
        score: score || 100,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }
}
