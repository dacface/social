import { randomUUID } from 'crypto';

import { NextResponse } from 'next/server';

import { getAdminStorageBucket } from '@/lib/firebase-admin';

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

    const bucket = getAdminStorageBucket();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const objectPath = `posts/${Date.now()}-${randomUUID()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucketFile = bucket.file(objectPath);
    const downloadToken = randomUUID();

    await bucketFile.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

    console.log('[POST /api/upload] Uploaded image to Firebase Storage', {
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
