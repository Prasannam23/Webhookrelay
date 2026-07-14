import rateLimit from "express-rate-limit";
import { RedisStore } from 'rate-limit-redis'
import Redis from 'ioredis'
import { env } from "../../config/env.js";

const redisClient = new Redis(env.REDIS_URL || process.env.REDIS_URL);


export function buildLimiter({windowMs, max, prefix}){
   return rateLimit({
    windowMs,
    max,
    standardHeaders:true,
    legacyHeaders:false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),

        prefix,
    }),
    message : {
        success:false,
        message:'too many request, please try again later'
    }


   })
}
export const ingestionLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max: 300,
  prefix: 'rl:ingestion:',
});

export const dashboardLimiter = buildLimiter({
  windowMs: 60 * 1000,
  max: 600,
  prefix: 'rl:dashboard:',
});