import {Worker} from 'bullmq'
import { connection } from './connection.js'
import { QUEUE_NAMES } from '../constants/index.js';
import { attemptDelivery, markDead } from '../services/delivery.service.js';
import logger from '../config/logger.js';


function createDeliveryWorker() {
  const worker = new Worker(
    QUEUE_NAMES.DELIVERY,
    async (job) => {
      await attemptDelivery(job.data);
    },
    {
      connection,
      concurrency: 10, 
    },
  );

  worker.on('completed', (job) => {
    logger.info(
      { jobId: job.id, deliveryAttemptId: job.data.deliveryAttemptId },
      'Delivery succeeded',
    );
  });

  worker.on('failed', async (job, err) => {
    const isFinalAttempt = job.attemptsMade >= job.opts.attempts;

    logger.warn(
      {
        jobId: job.id,
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts,
        err: err.message,
      },
      isFinalAttempt
        ? 'Delivery exhausted all retries — moving to dead letter'
        : 'Delivery attempt failed, will retry',
    );

    if (isFinalAttempt) {
      await markDead(
        job.data.deliveryAttemptId,
        `Exhausted ${job.opts.attempts} attempts: ${err.message}`,
      );
    }
  });

  worker.on('error', (err) => {
    logger.error({ err: err.message }, 'Worker-level error');
  });

  return worker;
}

export default createDeliveryWorker;