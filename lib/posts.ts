import type { DocumentData, DocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

export interface FeedPostRecord {
  id: string;
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  time: string;
  caption: string;
  hasMoreText: boolean;
  likes: number;
  likesText: string;
  comments: number;
  shares: number;
  imageUrl: string;
}

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=default';
const DEFAULT_NAME = 'Utilizator';

export function mapPostDocument(doc: DocumentSnapshot<DocumentData>): FeedPostRecord {
  const data = doc.data();

  if (!data) {
    throw new Error(`Post document "${doc.id}" has no data.`);
  }

  const timestamp = getTimestampInMillis(data.createdAt);
  const caption = getString(data.text);
  const likes = getCount(data.likesCount);
  const comments = getCount(data.commentsCount);
  const shares = getCount(data.sharesCount);

  return {
    id: doc.id,
    authorName: getString(data.userName) || DEFAULT_NAME,
    authorAvatar: getString(data.userAvatar) || DEFAULT_AVATAR,
    isVerified: Boolean(data.isVerified),
    time: formatTime(timestamp),
    caption,
    hasMoreText: caption.length > 200,
    likes,
    likesText: formatCount(likes),
    comments,
    shares,
    imageUrl: getString(data.imageUrl),
  };
}

export function buildOptimisticPost(input: {
  id: string;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  text?: string;
  imageUrl?: string;
}): FeedPostRecord {
  const caption = input.text?.trim() ?? '';

  return {
    id: input.id,
    authorName: input.userName?.trim() || DEFAULT_NAME,
    authorAvatar: input.userAvatar?.trim() || DEFAULT_AVATAR,
    isVerified: Boolean(input.isVerified),
    time: 'Acum',
    caption,
    hasMoreText: caption.length > 200,
    likes: 0,
    likesText: '0',
    comments: 0,
    shares: 0,
    imageUrl: input.imageUrl?.trim() ?? '',
  };
}

export function parseLimit(rawLimit: string | null, fallback = 20, max = 50) {
  const parsed = Number.parseInt(rawLimit ?? '', 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
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

function getCount(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatTime(timestampMs: number) {
  const diffMs = Date.now() - timestampMs;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) {
    return 'Acum';
  }

  if (diffMin < 60) {
    return `${diffMin} min`;
  }

  const diffH = Math.floor(diffMin / 60);

  if (diffH < 24) {
    return `${diffH}h`;
  }

  const diffD = Math.floor(diffH / 24);
  return `${diffD} zi${diffD > 1 ? 'le' : ''}`;
}

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}mii`;
  }

  return value.toString();
}
