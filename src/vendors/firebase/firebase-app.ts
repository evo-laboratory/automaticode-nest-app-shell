// * GDK Application Shell Default File
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const FirebaseApp = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

export default FirebaseApp;
export const FirebaseAuth = getAuth(FirebaseApp);
