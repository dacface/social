import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, postId, userId = 'anonymous', timestamp, text } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    const eventData = {
      type,
      postId: postId || null,
      userId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      ...(text && { text }),
      createdAt: new Date(),
    };

    // Store in Firebase 'events' collection
    await db.collection('events').add(eventData);

    return NextResponse.json({ success: true, eventId: eventData.type });
  } catch (error) {
    console.error('Track API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
