import * as admin from "firebase-admin";

function getApp(): admin.app.App {
  if (admin.apps.length) return admin.apps[0]!;

  const cred = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  return admin.initializeApp({
    credential: cred
      ? admin.credential.cert(cred)
      : admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

export const adminAuth = admin.auth(getApp());
export const adminDb = admin.firestore(getApp());

export function getAdminStorage(): admin.storage.Storage {
  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucket) throw new Error("FIREBASE_STORAGE_BUCKET is not set");
  return admin.storage(getApp());
}

/** @deprecated Use getAdminStorage().bucket() instead */
export const adminStorage = {
  file: (path: string) => getAdminStorage().bucket().file(path),
};
