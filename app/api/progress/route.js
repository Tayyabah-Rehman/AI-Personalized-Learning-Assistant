import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(req) {
  const { token, lessonKey, score } = await req.json();

  try {
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
