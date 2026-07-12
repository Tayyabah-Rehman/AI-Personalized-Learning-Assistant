let _adminDb;
let _adminAuth;
let _initialized = false;

function initAdmin() {
  if (_initialized) return;

  // Fail fast with clear error if env vars missing
  const requiredVars = [
    "FIREBASE_ADMIN_PROJECT_ID",
    "FIREBASE_ADMIN_CLIENT_EMAIL",
    "FIREBASE_ADMIN_PRIVATE_KEY",
  ];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      throw new Error(`Missing environment variable: ${v}`);
    }
  }

  const { initializeApp, getApps, cert } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");
  const { getAuth } = require("firebase-admin/auth");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  _adminDb = getFirestore();
  _adminAuth = getAuth();
  _initialized = true;
}

export function getAdminDb() {
  initAdmin();
  return _adminDb;
}

export function getAdminAuth() {
  initAdmin();
  return _adminAuth;
}
