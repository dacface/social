import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

// GET /api/posts — fetch latest posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit') || '20';
    const limit = Math.min(parseInt(limitParam, 10), 50);

    const snapshot = await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/posts — create a new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, userAvatar, text, imageUrl, isVerified } = body;

    if (!text && !imageUrl) {
      return NextResponse.json({ error: 'Post must have text or image' }, { status: 400 });
    }

    // Generate mock AI score
    const aiScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const aiTag = aiScore >= 80 ? 'credibil' : 'suspect';

    const postData = {
      userId: userId || 'anonymous',
      userName: userName || 'Utilizator',
      userAvatar: userAvatar || 'https://i.pravatar.cc/150?u=default',
      isVerified: isVerified || false,
      text: text || '',
      imageUrl: imageUrl || '',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      aiScore,
      aiTag,
      likedBy: [],
    };

    let postId = `local_${Date.now()}`;

    // Try to save to Firestore; if it fails (no credentials), continue anyway
    try {
      const docRef = await db.collection('posts').add({
        ...postData,
        createdAt: FieldValue.serverTimestamp(),
      });
      postId = docRef.id;
    } catch (firestoreErr) {
      console.warn('Firestore save failed (credentials may be missing), returning local post:', firestoreErr);
    }

    // Return the created post with client-usable data
    const responsePost = {
      id: postId,
      ...postData,
      createdAt: Date.now(),
    };

    return NextResponse.json({ success: true, post: responsePost });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
