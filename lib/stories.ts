import type { DocumentData, DocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

export interface StoryRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  timeLabel: string;
  createdAtMs: number;
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=default';
const DEFAULT_NAME = 'Utilizator';
const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function mapStoryDocument(doc: DocumentSnapshot<DocumentData>): StoryRecord {
  const data = doc.data();

  if (!data) {
    throw new Error(`Story document "${doc.id}" has no data.`);
  }

  const createdAtMs = getTimestampInMillis(data.createdAt);

  return {
    id: doc.id,
    userId: getString(data.userId) || 'anonymous',
    userName: getString(data.userName) || DEFAULT_NAME,
    userAvatar: getString(data.userAvatar) || DEFAULT_AVATAR,
    mediaUrl: getString(data.mediaUrl),
    mediaType: getMediaType(data.mediaType),
    caption: getString(data.caption),
    timeLabel: formatStoryTime(createdAtMs),
    createdAtMs,
  };
}

export function isStoryActive(story: StoryRecord) {
  return Date.now() - story.createdAtMs < STORY_LIFETIME_MS;
}

export function buildOptimisticStory(input: {
  id: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  caption?: string;
}): StoryRecord {
  return {
    id: input.id,
    userId: input.userId ?? 'anonymous',
    userName: input.userName?.trim() || DEFAULT_NAME,
    userAvatar: input.userAvatar?.trim() || DEFAULT_AVATAR,
    mediaUrl: input.mediaUrl?.trim() ?? '',
    mediaType: input.mediaType ?? 'image',
    caption: input.caption?.trim() ?? '',
    timeLabel: 'Acum',
    createdAtMs: Date.now(),
  };
}

function getTimestampInMillis(value: Timestamp | Date | { toMillis?: () => number } | undefined) {
  if (!value) {
    return Date.now();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if ('toMillis' in value && typeof value.toMillis === 'function') {
    return value.toMillis();
  }

  return Date.now();
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getMediaType(value: unknown): 'image' | 'video' {
  return value === 'video' ? 'video' : 'image';
}

function formatStoryTime(createdAtMs: number) {
  const diffMs = Date.now() - createdAtMs;
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

  if (diffHours < 1) {
    const diffMin = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    return `${diffMin} min`;
  }

  return `${diffHours}h`;
}
