import 'server-only';

import { cert, getApp, getApps, initializeApp, type App, type AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const normalizePrivateKey = (value?: string) => value?.replace(/\\n/g, '\n');

const normalizeBucketName = (value?: string) => {
  if (!value) {
    return undefined;
  }

  return value
    .trim()
    .replace(/^gs:\/\//, '')
    .replace(/^https?:\/\/storage\.googleapis\.com\//, '')
    .replace(/\/+$/, '');
};

const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
const storageBucketName = normalizeBucketName(
  process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
);

const hasServiceAccountEnv = Boolean(projectId && clientEmail && privateKey);

function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const options: AppOptions = {};

  if (projectId) {
    options.projectId = projectId;
  }

  if (storageBucketName) {
    options.storageBucket = storageBucketName;
  }

  if (hasServiceAccountEnv) {
    options.credential = cert({
      projectId: projectId!,
      clientEmail: clientEmail!,
      privateKey: privateKey!,
    });
  } else {
    console.warn(
      '[firebase-admin] Service account environment variables are incomplete. Falling back to default application credentials.'
    );
  }

  try {
    const app = initializeApp(options);

    console.log('[firebase-admin] Initialized admin SDK', {
      projectId: options.projectId ?? 'default',
      storageBucket: options.storageBucket ?? 'not-configured',
      credentialSource: hasServiceAccountEnv ? 'env' : 'application-default',
    });

    return app;
  } catch (error) {
    console.error('[firebase-admin] Failed to initialize admin SDK', {
      error,
      hasProjectId: Boolean(projectId),
      hasClientEmail: Boolean(clientEmail),
      hasPrivateKey: Boolean(privateKey),
      hasStorageBucket: Boolean(storageBucketName),
    });

    throw error;
  }
}

export const firebaseAdminApp = initializeFirebaseAdmin();
export const db = getFirestore(firebaseAdminApp);
export const auth = getAuth(firebaseAdminApp);
export const storage = getStorage(firebaseAdminApp);

function getStorageBucketCandidates() {
  const configuredBucket = storageBucketName ?? firebaseAdminApp.options.storageBucket;
  const candidates = new Set<string>();

  if (typeof configuredBucket === 'string' && configuredBucket.trim()) {
    candidates.add(configuredBucket.trim());
  }

  if (projectId) {
    candidates.add(`${projectId}.appspot.com`);
    candidates.add(`${projectId}.firebasestorage.app`);
  }

  return Array.from(candidates);
}

export function getAdminStorageBucket(bucketName?: string) {
  const resolvedBucketName = bucketName ?? getStorageBucketCandidates()[0];

  if (!resolvedBucketName) {
    const error = new Error(
      'Firebase Storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.'
    );

    console.error('[firebase-admin] No default bucket found', error);
    throw error;
  }

  return storage.bucket(resolvedBucketName);
}

export function getAdminStorageBucketCandidates() {
  return getStorageBucketCandidates().map((bucketName) => storage.bucket(bucketName));
}
