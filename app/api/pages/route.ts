import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGES = [
  {
    id: 'page-techstart',
    name: 'TechStart Romania',
    category: 'Companie media',
    followersCount: 45200,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-techstart',
    isVerified: true,
  },
  {
    id: 'page-nordia',
    name: 'Nordia Homes',
    category: 'Brand imobiliar',
    followersCount: 12600,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-nordia',
    isVerified: false,
  },
  {
    id: 'page-food',
    name: 'Bucharest Street Food',
    category: 'Comunitate locala',
    followersCount: 8800,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-food',
    isVerified: true,
  },
];

export async function GET() {
  try {
    await ensureDefaultPages();

    const snapshot = await db.collection('pages').orderBy('followersCount', 'desc').limit(20).get();
    const pages = snapshot.docs.map((doc) => mapPage(doc.data(), doc.id));

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('[GET /api/pages] Failed to load pages', error);
    return NextResponse.json({ error: 'Failed to load pages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = typeof body.action === 'string' ? body.action : 'create';
    const userId = getString(body.userId) || 'current_user';

    if (action === 'like' || action === 'unlike') {
      const pageId = getString(body.pageId);

      if (!pageId) {
        return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
      }

      await togglePageLike(pageId, userId, action === 'like');
      return NextResponse.json({ success: true });
    }

    const name = getString(body.name).trim();
    const category = getString(body.category).trim();

    if (!name || !category) {
      return NextResponse.json({ error: 'name and category are required' }, { status: 400 });
    }

    const docRef = db.collection('pages').doc();
    await docRef.set({
      name,
      category,
      followersCount: 0,
      creatorUid: userId,
      avatarUrl: `https://i.pravatar.cc/200?u=${docRef.id}`,
      isVerified: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const created = await docRef.get();
    return NextResponse.json({ success: true, page: mapPage(created.data() ?? {}, created.id) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/pages] Failed to mutate pages', error);
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }
}

async function ensureDefaultPages() {
  const snapshot = await db.collection('pages').limit(1).get();

  if (!snapshot.empty) {
    return;
  }

  const batch = db.batch();

  DEFAULT_PAGES.forEach((page) => {
    const ref = db.collection('pages').doc(page.id);
    batch.set(ref, {
      ...page,
      creatorUid: 'seed',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

async function togglePageLike(pageId: string, userId: string, shouldLike: boolean) {
  const pageRef = db.collection('pages').doc(pageId);
  const followerRef = pageRef.collection('followers').doc(userId);

  if (shouldLike) {
    await followerRef.set({ createdAt: FieldValue.serverTimestamp() });
    await pageRef.set({ followersCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return;
  }

  await followerRef.delete();
  await pageRef.set({ followersCount: FieldValue.increment(-1), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

function mapPage(data: Record<string, unknown>, id: string) {
  return {
    id,
    name: typeof data.name === 'string' ? data.name : 'Pagina',
    category: typeof data.category === 'string' ? data.category : '',
    followers: typeof data.followersCount === 'number' ? data.followersCount : 0,
    avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : '',
    isVerified: Boolean(data.isVerified),
  };
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}
