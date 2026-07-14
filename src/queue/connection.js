import Redis from 'ioredis';
import { env } from '../config/env.js';

// BullMQ requires maxRetriesPerRequest: null on the connection it uses —
// kept separate from the rate limiter's Redis connection for this reason.
export const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
