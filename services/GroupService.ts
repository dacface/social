import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export class GroupService {
  /**
   * Create a new group
   */
  static async createGroup(creatorUid: string, name: string, description: string, isPrivate: boolean) {
    const groupRef = db.collection('groups').doc();
    const batch = db.batch();

    batch.set(groupRef, {
      id: groupRef.id,
      name,
      description,
      isPrivate,
      membersCount: 1,
      createdAt: new Date(),
    });

    // Add creator as admin
    const memberRef = groupRef.collection('members').doc(creatorUid);
    batch.set(memberRef, { role: 'admin', joinedAt: new Date() });

    await batch.commit();
    return groupRef.id;
  }

  /**
   * Join a group
   */
  static async joinGroup(uid: string, groupId: string) {
    const groupRef = db.collection('groups').doc(groupId);
    const memberRef = groupRef.collection('members').doc(uid);

    const batch = db.batch();
    batch.set(memberRef, { role: 'user', joinedAt: new Date() });
    batch.update(groupRef, { membersCount: FieldValue.increment(1) });
    
    await batch.commit();
  }
}

export class PageService {
  /**
   * Create a business page
   */
  static async createPage(creatorUid: string, name: string, category: string) {
    const pageRef = db.collection('pages').doc();
    await pageRef.set({
      id: pageRef.id,
      name,
      category,
      followersCount: 0,
      creatorUid,
      createdAt: new Date(),
    });
    return pageRef.id;
  }
}
