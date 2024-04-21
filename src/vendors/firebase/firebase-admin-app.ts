// * GDK Application Shell Default File
// * Document Reference:
// * https://firebase.google.com/docs/admin/setup

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const FirebaseAdminApp = initializeApp({
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  credential: cert({
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: `${process.env.FIREBASE_ADMIN_PRIVATE_KEY}`,
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
});

export default FirebaseAdminApp;
export const FirebaseAdminAuth = getAuth(FirebaseAdminApp);
