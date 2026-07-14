import express from 'express';
import {prisma} from '../../db/client.js';
import {connection} from '../../queue/connection.js';
import {asyncHandler} from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = express.Router();

router.get('/live', (req, res) => sendSuccess(res, { data: { status: 'ok' } }));

router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    const checks = { database: false, redis: false };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (err) {
      // left false
    }

    checks.redis = redisConnection.status === 'ready';

    const healthy = Object.values(checks).every(Boolean);
    return sendSuccess(res, { statusCode: healthy ? 200 : 503, data: checks });
  }),
);

export default router;