import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/firebase-admin';
import { mapPostDocument, parseLimit } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get('limit'), 6, 12);
    const cursor = searchParams.get('cursor');

    let query = db.collection('posts').orderBy('createdAt', 'desc').limit(Math.max(limit * 4, 20));

    if (cursor) {
      const cursorDoc = await db.collection('posts').doc(cursor).get();

      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      } else {
        console.warn('[GET /api/reels] Ignoring unknown cursor', { cursor });
      }
    }

    const snapshot = await query.get();
    const reels = snapshot.docs
      .filter((doc) => doc.data()?.type === 'reel')
      .slice(0, limit)
      .map(mapPostDocument);
    const nextCursor = reels.length === limit ? reels[reels.length - 1]?.id ?? null : null;

    console.log('[GET /api/reels] Loaded reels from Firestore', {
      count: reels.length,
      cursor: cursor ?? null,
      nextCursor,
    });

    return NextResponse.json({ reels, items: reels, nextCursor });
  } catch (error) {
    console.error('[GET /api/reels] Failed to load reels from Firestore', error);
    return NextResponse.json({ error: 'Failed to load reels from Firestore' }, { status: 500 });
  }
}
