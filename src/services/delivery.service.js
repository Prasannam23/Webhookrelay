import axios from 'axios';
import {prisma} from '../db/client.js';
import { getDecryptedSecret } from './subscriber.service.js';
import { signPayload } from '../utils/signature.js'
import { DELIVERY_STATUS, DELIVERY_TIMEOUT_MS } from '../constants/index.js';
import logger from '../config/logger.js';

async function attemptDelivery({ deliveryAttemptId, eventId, subscriberId }) {
  const [event, subscriber] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.subscriber.findUnique({ where: { id: subscriberId } }),
  ]);

  if (!event || !subscriber) {
    await markDead(deliveryAttemptId, 'Event or subscriber no longer exists');
    return;
  }

  const secret = await getDecryptedSecret(subscriberId);
  const timestamp = Date.now().toString();

  console.log('SIGNING — secret:', JSON.stringify(secret));
console.log('SIGNING — timestamp:', timestamp);
console.log('SIGNING — payload:', JSON.stringify(event.payload));
console.log('SIGNING — full signed string:', `${timestamp}.${JSON.stringify(event.payload)}`);

  const signature = signPayload({ payload: event.payload, secret, timestamp });

  await markAttemptStarted(deliveryAttemptId);

  try {
    const response = await axios.post(subscriber.targetUrl, event.payload, {
      timeout: DELIVERY_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestamp,
        'X-Webhook-Topic': event.topic,
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });
    await markDelivered(deliveryAttemptId, response.status);
  } catch (err) {
    const responseCode = err.response?.status ?? null;
    const errorMessage = err.response ? `HTTP ${responseCode}` : err.message;
    await markAttemptFailed(deliveryAttemptId, { responseCode, errorMessage });
    throw err;
  }
}

async function markAttemptStarted(deliveryAttemptId) {
  return prisma.deliveryAttempt.update({
    where: { id: deliveryAttemptId },
    data: { status: DELIVERY_STATUS.RETRYING, attemptCount: { increment: 1 } },
  });
}

async function markDelivered(deliveryAttemptId, responseCode) {
  const updated = await prisma.deliveryAttempt.update({
    where: { id: deliveryAttemptId },
    data: {
      status: DELIVERY_STATUS.DELIVERED,
      lastResponseCode: responseCode,
      deliveredAt: new Date(),
    },
  });
  broadcastStatus(updated);
  return updated;
}

async function markAttemptFailed(deliveryAttemptId, { responseCode, errorMessage }) {
  const updated = await prisma.deliveryAttempt.update({
    where: { id: deliveryAttemptId },
    data: {
      lastResponseCode: responseCode,
      lastError: errorMessage,
    },
  });
  broadcastStatus(updated);
  return updated;
}

async function markDead(deliveryAttemptId, reason) {
  const updated = await prisma.deliveryAttempt.update({
    where: { id: deliveryAttemptId },
    data: { status: DELIVERY_STATUS.DEAD, lastError: reason },
  });
  broadcastStatus(updated);
  logger.warn({ deliveryAttemptId, reason }, 'Delivery marked dead');
  return updated;
}

async function broadcastStatus(deliveryAttempt) {
  try {
    const { emitDeliveryUpdate } = await import('../sockets/index.js');
    emitDeliveryUpdate(deliveryAttempt);
  } catch (err) {
    logger.warn({ err: err.message }, 'Socket broadcast skipped (io not initialized)');
  }
}

export { attemptDelivery, markDead  };