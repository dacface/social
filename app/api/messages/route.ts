import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const CURRENT_USER_ID = 'current_user';

const DEFAULT_THREADS = [
  {
    id: 'thread-alexandra',
    name: 'Alexandra Rus',
    avatar: 'https://i.pravatar.cc/150?u=msg-alexandra',
    messages: [
      { senderId: 'alexandra', text: 'Ai vazut ultimele reactii la postarea despre fact-checking?' },
      { senderId: CURRENT_USER_ID, text: 'Da, si cred ca merita transformata intr-o dezbatere separata.' },
    ],
  },
  {
    id: 'thread-dacface',
    name: 'Echipa Dacface',
    avatar: 'https://i.pravatar.cc/150?u=msg-dacface',
    messages: [{ senderId: 'dacface', text: 'Am activat noile suprafete pentru marketplace si evenimente.' }],
  },
];

export async function GET() {
  try {
    await ensureDefaultThreads();

    const snapshot = await db.collection('conversations').orderBy('updatedAt', 'desc').limit(20).get();
    const conversations = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const messagesSnapshot = await doc.ref.collection('messages').orderBy('createdAt', 'asc').limit(50).get();

        return {
          id: doc.id,
          name: doc.data().name ?? 'Converstatie',
          avatar: doc.data().avatar ?? 'https://i.pravatar.cc/150?u=conversation',
          messages: messagesSnapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            fromMe: messageDoc.data().senderId === CURRENT_USER_ID,
            text: messageDoc.data().text ?? '',
          })),
        };
      })
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('[GET /api/messages] Failed to load conversations', error);
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conversationId = getString(body.conversationId);
    const text = getString(body.text).trim();

    if (!conversationId || !text) {
      return NextResponse.json({ error: 'conversationId and text are required' }, { status: 400 });
    }

    const conversationRef = db.collection('conversations').doc(conversationId);
    const messageRef = conversationRef.collection('messages').doc();

    await messageRef.set({
      senderId: CURRENT_USER_ID,
      text,
      createdAt: FieldValue.serverTimestamp(),
    });

    await conversationRef.set(
      {
        lastMessage: text,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: {
        id: messageRef.id,
        fromMe: true,
        text,
      },
    });
  } catch (error) {
    console.error('[POST /api/messages] Failed to send message', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

async function ensureDefaultThreads() {
  const snapshot = await db.collection('conversations').limit(1).get();

  if (!snapshot.empty) {
    return;
  }

  for (const thread of DEFAULT_THREADS) {
    const conversationRef = db.collection('conversations').doc(thread.id);

    await conversationRef.set({
      name: thread.name,
      avatar: thread.avatar,
      lastMessage: thread.messages[thread.messages.length - 1]?.text ?? '',
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    for (const message of thread.messages) {
      await conversationRef.collection('messages').add({
        senderId: message.senderId,
        text: message.text,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
