let adminDb;
let adminAuth;

function getAdminDb() {
  if (!adminDb) initAdmin();
  return adminDb;
}

function getAdminAuth() {
  if (!adminAuth) initAdmin();
  return adminAuth;
}

function initAdmin() {
  const { initializeApp, getApps, cert } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");
  const { getAuth } = require("firebase-admin/auth");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  adminDb = getFirestore();
  adminAuth = getAuth();
}

export { getAdminDb, getAdminAuth };
