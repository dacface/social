import { db } from '@/lib/firebase-admin';

export class ReelsService {
  /**
   * Fetch Reels Feed (Vertical Video Feed)
   */
  static async getReelsFeed(uid: string, cursor?: string, limit: number = 10) {
    // Reels are stored separately or just as posts with type = 'reel'
    let query = db.collection('posts')
      .where('type', '==', 'reel')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (cursor) {
      const cursorDoc = await db.collection('posts').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
