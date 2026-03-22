import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Idea, Debate, Argument } from '@/types/schema';

export class DebateService {
  /**
   * Creates a new idea or returns an existing debate if a similar idea exists.
   * Core principle: one idea = one debate. No duplicate debates allowed.
   */
  static async createIdea(uid: string, title: string, description: string): Promise<{ ideaId: string, debateId: string }> {
    // Idea deduplication logic would normally use embeddings/vector search.
    // We assume an external AI service checks for duplicates before calling this.
    // For now, we create the idea and the debate simultaneously.
    
    // Create Idea
    const ideaRef = db.collection('ideas').doc();
    const ideaId = ideaRef.id;

    // Create Debate
    const debateRef = db.collection('debates').doc();
    const debateId = debateRef.id;

    const batch = db.batch();

    const createdAt = new Date();

    batch.set(ideaRef, {
      id: ideaId,
      title,
      description,
      creatorUid: uid,
      debateId,
      createdAt,
    });

    batch.set(debateRef, {
      id: debateId,
      ideaId,
      creatorUid: uid,
      participantsCount: 1,
      argumentsCount: 0,
      proCount: 0,
      contraCount: 0,
      createdAt,
    });

    await batch.commit();

    // Trigger Pub/Sub to generate feeds (Fan out debate to followers/trending)
    // publishToTopic('NEW_CONTENT', { type: 'debate', contentId: debateId, creatorUid: uid, previewData: { title } })

    return { ideaId, debateId };
  }

  /**
   * Add a PRO or CONTRA argument to a debate.
   */
  static async addArgument(debateId: string, uid: string, stance: 'PRO' | 'CONTRA', content: string): Promise<string> {
    const argumentRef = db.collection('arguments').doc();
    const argumentId = argumentRef.id;

    const batch = db.batch();
    
    // Add the argument
    batch.set(argumentRef, {
      id: argumentId,
      debateId,
      uid,
      stance,
      content,
      score: 0,
      repliesCount: 0,
      createdAt: new Date(),
    });

    // Update debate aggregation counters
    const debateRef = db.collection('debates').doc(debateId);
    
    // Use Firestore increment operator
    const increment = FieldValue.increment(1);
    
    const updateData: any = {
      argumentsCount: increment,
    };
    
    if (stance === 'PRO') {
      updateData.proCount = increment;
    } else {
      updateData.contraCount = increment;
    }

    batch.update(debateRef, updateData);

    await batch.commit();

    return argumentId;
  }
}
