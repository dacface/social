import { Redis } from 'ioredis';

// Use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN or a standard Redis connection URl
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return 'redis://localhost:6379'; // Fallback for local development
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));
