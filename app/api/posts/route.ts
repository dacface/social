import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '@/lib/firebase-admin';
import { buildOptimisticPost, mapPostDocument, parseLimit } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get('limit'));

    console.log('[GET /api/posts] Fetching posts from Firestore', { limit });

    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(limit).get();
    const posts = snapshot.docs.map(mapPostDocument);

    console.log('[GET /api/posts] Successfully fetched posts', { count: posts.length });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('[GET /api/posts] Failed to fetch posts from Firestore', error);
    return NextResponse.json({ error: 'Failed to fetch posts from Firestore' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = getContentType(body.type);
    const userId = getOptionalString(body.userId) || 'anonymous';
    const userName = getOptionalString(body.userName) || 'Utilizator';
    const userAvatar = getOptionalString(body.userAvatar) || 'https://i.pravatar.cc/150?u=default';
    const text = getOptionalString(body.text).trim();
    const imageUrl = getOptionalString(body.imageUrl).trim();
    const videoUrl = getOptionalString(body.videoUrl).trim();
    const isVerified = Boolean(body.isVerified);

    if (type === 'reel' && !videoUrl) {
      return NextResponse.json({ error: 'Reel must contain a video' }, { status: 400 });
    }

    if (type === 'post' && !text && !imageUrl) {
      return NextResponse.json({ error: 'Post must contain text or image' }, { status: 400 });
    }

    const aiScore = Math.floor(Math.random() * 40) + 60;
    const aiTag = aiScore >= 80 ? 'credibil' : 'suspect';

    console.log('[POST /api/posts] Creating post', {
      type,
      userId,
      hasText: Boolean(text),
      hasImage: Boolean(imageUrl),
      hasVideo: Boolean(videoUrl),
    });

    await ensureUserDocument({
      userId,
      userName,
      userAvatar,
      isVerified,
    });

    const docRef = db.collection('posts').doc();

    await docRef.set({
      type,
      userId,
      userName,
      userAvatar,
      isVerified,
      text,
      imageUrl,
      videoUrl,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      aiScore,
      aiTag,
      likedBy: [],
    });

    const createdDoc = await docRef.get();

    if (!createdDoc.exists) {
      console.error('[POST /api/posts] Post write completed but document could not be reloaded', { postId: docRef.id });
      return NextResponse.json(
        {
          success: true,
          post: buildOptimisticPost({ id: docRef.id, type, userName, userAvatar, isVerified, text, imageUrl, videoUrl }),
        },
        { status: 201 }
      );
    }

    console.log('[POST /api/posts] Post saved to Firestore', { postId: docRef.id });

    return NextResponse.json({ success: true, post: mapPostDocument(createdDoc) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/posts] Failed to save post to Firestore', error);
    return NextResponse.json({ error: 'Failed to save post to Firestore' }, { status: 500 });
  }
}

async function ensureUserDocument(input: {
  userId: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
}) {
  const userRef = db.collection('users').doc(input.userId);
  const existingUser = await userRef.get();

  await userRef.set(
    {
      uid: input.userId,
      name: input.userName,
      avatarUrl: input.userAvatar,
      role: 'user',
      isVerified: input.isVerified,
      updatedAt: FieldValue.serverTimestamp(),
      ...(existingUser.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true }
  );

  if (!existingUser.exists) {
    console.log('[POST /api/posts] Created missing Firestore user document', { userId: input.userId });
  }
}

function getOptionalString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getContentType(value: unknown): 'post' | 'reel' {
  return value === 'reel' ? 'reel' : 'post';
}
