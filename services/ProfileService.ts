import { db } from '@/lib/firebase-admin';

export class ProfileService {
  /**
   * Fetches public profile data
   */
  static async getProfile(uid: string) {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return null;
    return userDoc.data();
  }

  /**
   * Follow a user
   */
  static async followUser(followerUid: string, targetUid: string) {
    if (followerUid === targetUid) throw new Error('Cannot follow yourself');

    const batch = db.batch();

    // Add to target's followers list
    const followerRef = db.collection('users').doc(targetUid).collection('followers').doc(followerUid);
    batch.set(followerRef, { createdAt: new Date() });

    // Add to follower's following list
    const followingRef = db.collection('users').doc(followerUid).collection('following').doc(targetUid);
    batch.set(followingRef, { createdAt: new Date() });

    // We can also trigger Pub/Sub to backfill feed items
    
    await batch.commit();
  }

  /**
   * Get all personalities for discovery
   */
  static async getPersonalities() {
    const snapshot = await db.collection('users')
      .where('role', '==', 'public_figure')
      .orderBy('reputation.globalScore', 'desc')
      .limit(50)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
