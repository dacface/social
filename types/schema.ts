import { Timestamp } from 'firebase-admin/firestore';

export type Role = 'admin' | 'moderator' | 'user' | 'public_figure';

export interface User {
  uid: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  verificationLabel?: string; // e.g., "Inițiator dezbatere"
  reputation: {
    globalScore: number;
    domainScores: Record<string, number>;
  };
  bio?: string;
  location?: string;
  createdAt: Timestamp;
}

export interface Post {
  id: string;
  uid: string;
  type: 'post' | 'reel';
  mediaUrl?: string;
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  factCheck?: {
    label: 'false' | 'misleading' | 'missing_context';
    details?: string;
  };
  createdAt: Timestamp;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  creatorUid: string;
  debateId?: string; // Link to the active debate
  createdAt: Timestamp;
}

export interface Debate {
  id: string;
  ideaId: string; // Foreign key
  creatorUid: string;
  participantsCount: number;
  argumentsCount: number;
  proCount: number;
  contraCount: number;
  createdAt: Timestamp;
}

export interface Argument {
  id: string;
  debateId: string;
  uid: string;
  stance: 'PRO' | 'CONTRA';
  content: string;
  score: number;
  repliesCount: number;
  createdAt: Timestamp;
}

export interface FeedItem {
  id: string; // Document ID in feeds/{uid}/items
  type: 'post' | 'reel' | 'debate' | 'group' | 'page';
  contentId: string; // ID of the referenced document
  previewData?: any; // Denormalized preview fields to avoid extra reads
  createdAt: Timestamp;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  membersCount: number;
  createdAt: Timestamp;
}

export interface Page {
  id: string;
  name: string;
  category: string;
  followersCount: number;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  conversationId: string;
  senderUid: string;
  content: string;
  mediaUrl?: string;
  readBy: string[];
  createdAt: Timestamp;
}
