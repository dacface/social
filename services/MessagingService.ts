import { db } from '@/lib/firebase-admin';

export class MessagingService {
  /**
   * Send a message to a conversation
   */
  static async sendMessage(conversationId: string, senderUid: string, content: string, mediaUrl?: string) {
    const messageRef = db.collection('conversations').doc(conversationId).collection('messages').doc();
    const conversationRef = db.collection('conversations').doc(conversationId);

    const batch = db.batch();
    const createdAt = new Date();

    const messageData = {
      id: messageRef.id,
      conversationId,
      senderUid,
      content,
      mediaUrl,
      readBy: [senderUid],
      createdAt,
    };

    batch.set(messageRef, messageData);

    // Update conversation last activity
    batch.update(conversationRef, {
      lastMessage: content,
      lastMessageAt: createdAt,
      updatedAt: createdAt,
    });

    await batch.commit();

    // To implement "Real-time" chat, the mobile client will listen to Firestore 
    // `snapshot.listen('conversations/{id}/messages')`.
    // Firebase handles the WebSockets automatically.

    return messageRef.id;
  }
}
