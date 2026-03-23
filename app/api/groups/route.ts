import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_GROUPS = [
  {
    id: 'group-social-media-ro',
    name: 'Social Media Romania',
    description: 'Strategii, trenduri si studii de caz pentru creatorii locali.',
    membersCount: 12800,
    isPrivate: false,
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'group-founders-startup',
    name: 'Fondatori si Startup Cafe',
    description: 'Discutii despre produs, growth si fundraising.',
    membersCount: 5400,
    isPrivate: true,
    coverUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'group-mobile-photo',
    name: 'Pasionati de fotografie mobila',
    description: 'Tips, editare si provocari saptamanale pentru telefon.',
    membersCount: 9100,
    isPrivate: false,
    coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
  },
];

export async function GET() {
  try {
    await ensureDefaultGroups();

    const snapshot = await db.collection('groups').orderBy('membersCount', 'desc').limit(20).get();
    const groups = snapshot.docs.map((doc) => mapGroup(doc.data(), doc.id));

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('[GET /api/groups] Failed to load groups', error);
    return NextResponse.json({ error: 'Failed to load groups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = typeof body.action === 'string' ? body.action : 'create';
    const userId = getString(body.userId) || 'current_user';

    if (action === 'join' || action === 'leave') {
      const groupId = getString(body.groupId);

      if (!groupId) {
        return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
      }

      await toggleMembership(groupId, userId, action === 'join');

      return NextResponse.json({ success: true });
    }

    const name = getString(body.name).trim();
    const description = getString(body.description).trim();
    const isPrivate = Boolean(body.isPrivate);

    if (!name || !description) {
      return NextResponse.json({ error: 'name and description are required' }, { status: 400 });
    }

    const docRef = db.collection('groups').doc();
    await docRef.set({
      name,
      description,
      isPrivate,
      membersCount: 1,
      coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      creatorUid: userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await db.collection('groups').doc(docRef.id).collection('members').doc(userId).set({
      role: 'admin',
      joinedAt: FieldValue.serverTimestamp(),
    });

    const created = await docRef.get();
    return NextResponse.json({ success: true, group: mapGroup(created.data() ?? {}, created.id) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/groups] Failed to mutate groups', error);
    return NextResponse.json({ error: 'Failed to save group' }, { status: 500 });
  }
}

async function ensureDefaultGroups() {
  const snapshot = await db.collection('groups').limit(1).get();

  if (!snapshot.empty) {
    return;
  }

  const batch = db.batch();

  DEFAULT_GROUPS.forEach((group) => {
    const ref = db.collection('groups').doc(group.id);
    batch.set(ref, {
      ...group,
      creatorUid: 'seed',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

async function toggleMembership(groupId: string, userId: string, shouldJoin: boolean) {
  const groupRef = db.collection('groups').doc(groupId);
  const memberRef = groupRef.collection('members').doc(userId);

  if (shouldJoin) {
    await memberRef.set({
      role: 'user',
      joinedAt: FieldValue.serverTimestamp(),
    });
    await groupRef.set({ membersCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return;
  }

  await memberRef.delete();
  await groupRef.set({ membersCount: FieldValue.increment(-1), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

function mapGroup(data: Record<string, unknown>, id: string) {
  return {
    id,
    name: typeof data.name === 'string' ? data.name : 'Grup',
    description: typeof data.description === 'string' ? data.description : '',
    members: typeof data.membersCount === 'number' ? data.membersCount : 0,
    isPrivate: Boolean(data.isPrivate),
    coverUrl: typeof data.coverUrl === 'string' ? data.coverUrl : '',
  };
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
