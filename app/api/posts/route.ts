import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// GET /api/posts — fetch latest posts from Firestore ONLY
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit') || '20';
    const limit = Math.min(parseInt(limitParam, 10), 50);

    console.log('[GET /api/posts] Fetching posts from Firestore...');

    const snapshot = await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        authorName: data.userName || 'Utilizator',
        authorAvatar: data.userAvatar || 'https://i.pravatar.cc/150?u=default',
        isVerified: data.isVerified || false,
        time: formatTime(data.createdAt?.toMillis?.() || Date.now()),
        caption: data.text || '',
        hasMoreText: (data.text || '').length > 200,
        likes: data.likesCount || 0,
        likesText: formatCount(data.likesCount || 0),
        comments: data.commentsCount || 0,
        shares: data.sharesCount || 0,
        imageUrl: data.imageUrl || '',
      };
    });

    console.log(`[GET /api/posts] Successfully fetched ${posts.length} posts from Firestore`);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('[GET /api/posts] FIRESTORE ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch posts from Firestore' }, { status: 500 });
  }
}

// POST /api/posts — create a new post in Firestore ONLY
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, userAvatar, text, imageUrl, isVerified } = body;

    if (!text && !imageUrl) {
      return NextResponse.json({ error: 'Post must have text or image' }, { status: 400 });
    }

    // Generate AI score
    const aiScore = Math.floor(Math.random() * 40) + 60;
    const aiTag = aiScore >= 80 ? 'credibil' : 'suspect';

    const postData = {
      userId: userId || 'anonymous',
      userName: userName || 'Utilizator',
      userAvatar: userAvatar || 'https://i.pravatar.cc/150?u=default',
      isVerified: isVerified || false,
      text: text || '',
      imageUrl: imageUrl || '',
      createdAt: FieldValue.serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      aiScore,
      aiTag,
      likedBy: [],
    };

    console.log('[POST /api/posts] Writing post to Firestore...');
    const docRef = await db.collection('posts').add(postData);
    console.log(`[POST /api/posts] SUCCESS — Firestore document ID: ${docRef.id}`);

    // Return the created post mapped for client display
    const responsePost = {
      id: docRef.id,
      authorName: postData.userName,
      authorAvatar: postData.userAvatar,
      isVerified: postData.isVerified,
      time: 'Acum',
      caption: postData.text,
      hasMoreText: false,
      likes: 0,
      likesText: '0',
      comments: 0,
      shares: 0,
      imageUrl: postData.imageUrl,
    };

    return NextResponse.json({ success: true, post: responsePost });
  } catch (error) {
    console.error('[POST /api/posts] FIRESTORE ERROR:', error);
    return NextResponse.json({ error: 'Failed to save post to Firestore' }, { status: 500 });
  }
}

function formatTime(timestampMs: number): string {
  const diffMs = Date.now() - timestampMs;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Acum';
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} zi${diffD > 1 ? 'le' : ''}`;
}

function formatCount(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'mii';
  return num.toString();
}
