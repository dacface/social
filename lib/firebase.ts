import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const normalizeBucketName = (value?: string) => {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/^gs:\/\//, '').replace(/\/+$/, '');
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: normalizeBucketName(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  console.error('[firebase-client] Missing Firebase client environment variables', missingConfig);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

console.log('[firebase-client] Initialized client SDK', {
  projectId: firebaseConfig.projectId ?? 'missing',
  storageBucket: firebaseConfig.storageBucket ?? 'missing',
});

export const clientDb = getFirestore(app);
export const clientStorage = firebaseConfig.storageBucket
  ? getStorage(app, firebaseConfig.storageBucket)
  : getStorage(app);
export default app;
