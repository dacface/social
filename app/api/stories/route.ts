import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '@/lib/firebase-admin';
import { buildOptimisticStory, isStoryActive, mapStoryDocument } from '@/lib/stories';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get('limit') ?? '12', 10) || 12, 1), 24);
    const snapshot = await db.collection('stories').orderBy('createdAt', 'desc').limit(limit * 3).get();
    const stories = snapshot.docs.map(mapStoryDocument).filter(isStoryActive).slice(0, limit);

    console.log('[GET /api/stories] Loaded stories from Firestore', { count: stories.length });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('[GET /api/stories] Failed to load stories from Firestore', error);
    return NextResponse.json({ error: 'Failed to load stories from Firestore' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = getOptionalString(body.userId) || 'anonymous';
    const userName = getOptionalString(body.userName) || 'Utilizator';
    const userAvatar = getOptionalString(body.userAvatar) || 'https://i.pravatar.cc/150?u=default';
    const mediaUrl = getOptionalString(body.mediaUrl).trim();
    const mediaType = body.mediaType === 'video' ? 'video' : 'image';
    const caption = getOptionalString(body.caption).trim();

    if (!mediaUrl) {
      return NextResponse.json({ error: 'Story must contain media' }, { status: 400 });
    }

    const docRef = db.collection('stories').doc();

    await docRef.set({
      userId,
      userName,
      userAvatar,
      mediaUrl,
      mediaType,
      caption,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: FieldValue.serverTimestamp(),
    });

    const createdDoc = await docRef.get();

    if (!createdDoc.exists) {
      return NextResponse.json(
        {
          success: true,
          story: buildOptimisticStory({ id: docRef.id, userId, userName, userAvatar, mediaUrl, mediaType, caption }),
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ success: true, story: mapStoryDocument(createdDoc) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/stories] Failed to save story to Firestore', error);
    return NextResponse.json({ error: 'Failed to save story to Firestore' }, { status: 500 });
  }
}

function getOptionalString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
