import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { redis } from '@/lib/redis';
import { FeedItem } from '@/types/schema';

export const dynamic = 'force-dynamic';

// GET /api/feed?uid=user123&cursor=timestamp
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const cursor = searchParams.get('cursor'); // A timestamp or item ID for pagination
    const limitParams = searchParams.get('limit') || '10';
    const limit = parseInt(limitParams, 10) > 20 ? 20 : parseInt(limitParams, 10); // Max 20

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    const cacheKey = `feed:${uid}:page:${cursor || 'first'}`;

    // 1. Try Cache First
    const cachedFeed = await redis.get(cacheKey);
    if (cachedFeed) {
      return NextResponse.json(JSON.parse(cachedFeed));
    }

    // 2. Fetch from Firestore if not in cache
    let feedsRef = db.collection('feeds').doc(uid).collection('items')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      // Assuming cursor is the last document's createdAt timestamp or ID. 
      // For simplicity, using startAfter with timestamp if provided
      const cursorDoc = await db.collection('feeds').doc(uid).collection('items').doc(cursor).get();
      if (cursorDoc.exists) {
        feedsRef = feedsRef.startAfter(cursorDoc);
      }
    }

    const snapshot = await feedsRef.get();
    
    if (snapshot.empty) {
      console.log('[GET /api/feed] No feed items found for user:', uid);
      return NextResponse.json({ items: [], nextCursor: null });
    }

    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, // FeedItem id
        type: data.type,
        contentId: data.contentId,
        previewData: data.previewData,
        createdAt: data.createdAt.toMillis(),
      } as Partial<FeedItem>;
    });

    const nextCursor = items.length === limit ? items[items.length - 1].id : null;

    const responseData = { items, nextCursor, fallback: false };

    // 4. Cache the localized result
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60 * 5); // 5 min cache

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Feed API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
