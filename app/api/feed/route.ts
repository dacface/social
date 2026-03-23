import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/firebase-admin';
import { mapPostDocument, parseLimit } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get('limit'), 10, 20);
    const cursor = searchParams.get('cursor');

    let query = db.collection('posts').orderBy('createdAt', 'desc').limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection('posts').doc(cursor).get();

      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      } else {
        console.warn('[GET /api/feed] Ignoring unknown cursor', { cursor });
      }
    }

    const snapshot = await query.get();
    const posts = snapshot.docs.map(mapPostDocument);
    const nextCursor = snapshot.size === limit ? snapshot.docs[snapshot.docs.length - 1]?.id ?? null : null;

    console.log('[GET /api/feed] Loaded feed from Firestore', {
      count: posts.length,
      cursor: cursor ?? null,
      nextCursor,
    });

    return NextResponse.json({ posts, items: posts, nextCursor });
  } catch (error) {
    console.error('[GET /api/feed] Failed to load feed from Firestore', error);
    return NextResponse.json({ error: 'Failed to load feed from Firestore' }, { status: 500 });
  }
}
