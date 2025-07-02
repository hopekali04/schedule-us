import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';



// Initialize Firebase Admin only if it hasn't been initialized yet
if (!getApps().length) {
  admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
export { adminAuth, adminDb };