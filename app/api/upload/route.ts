import { randomUUID } from 'crypto';

import { NextResponse } from 'next/server';

import { getAdminStorageBucketCandidates } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are supported' }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be between 1 byte and 10 MB' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectPath = `posts/${Date.now()}-${randomUUID()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const downloadToken = randomUUID();
    const bucketErrors: string[] = [];
    let uploadedBucketName: string | null = null;

    for (const bucket of getAdminStorageBucketCandidates()) {
      try {
        await bucket.file(objectPath).save(buffer, {
          resumable: false,
          metadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000, immutable',
            metadata: {
              firebaseStorageDownloadTokens: downloadToken,
            },
          },
        });

        uploadedBucketName = bucket.name;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        bucketErrors.push(`${bucket.name}: ${message}`);
        console.warn('[POST /api/upload] Upload failed for bucket candidate', {
          bucket: bucket.name,
          error: message,
        });
      }
    }

    if (!uploadedBucketName) {
      throw new Error(bucketErrors.join(' | ') || 'No Firebase Storage bucket accepted the upload');
    }

    const url = `https://firebasestorage.googleapis.com/v0/b/${uploadedBucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

    console.log('[POST /api/upload] Uploaded image to Firebase Storage', {
      bucket: uploadedBucketName,
      objectPath,
      size: file.size,
      type: file.type,
    });

    return NextResponse.json({ success: true, url }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/upload] Failed to upload image', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error && process.env.NODE_ENV !== 'production'
            ? `Failed to upload image: ${error.message}`
            : 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
