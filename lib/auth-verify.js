// Verify Firebase ID token on every API request
// This ensures only logged-in users can use AI features

export async function verifyAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, error: "No token provided" };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token || token.length > 2000) {
    return { authenticated: false, error: "Invalid token format" };
  }

  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);

    // Check token not expired
    if (decoded.exp * 1000 < Date.now()) {
      return { authenticated: false, error: "Token expired" };
    }

    return { authenticated: true, uid: decoded.uid, email: decoded.email };
  } catch (err) {
    return { authenticated: false, error: "Invalid token" };
  }
}
