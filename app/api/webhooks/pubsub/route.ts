import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// POST /api/webhooks/pubsub
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || !body.message.data) {
      return NextResponse.json({ error: 'Invalid Pub/Sub payload' }, { status: 400 });
    }

    // Decode base64 data
    const dataString = Buffer.from(body.message.data, 'base64').toString('utf-8');
    const { eventType, contentId, creatorUid, type, previewData } = JSON.parse(dataString);

    if (eventType !== 'NEW_CONTENT') {
      return NextResponse.json({ success: true, message: 'Ignored event type' });
    }

    // Process fan-out
    // 1. Fetch followers of creatorUid
    const followersSnapshot = await db.collection('users').doc(creatorUid).collection('followers').get();
    
    // 2. Add to each follower's feed
    const batch = db.batch();
    const createdAt = new Date();

    followersSnapshot.docs.forEach((doc) => {
      const followerUid = doc.id;
      const feedItemRef = db.collection('feeds').doc(followerUid).collection('items').doc(); // Auto-id

      batch.set(feedItemRef, {
        type,
        contentId,
        previewData,
        createdAt,
      });
    });

    // In a massive scale, we might need to paginate the batch (max 500 writes per batch in Firestore).
    // For MVP we assume followers < 500 or we chunk it.
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pub/Sub Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
