import {prisma} from '../db/client.js';
import { findActiveSubscribersForTopic } from './subscriber.service.js';
import { enqueueDelivery } from '../queue/delivery.queue.js';
import { DELIVERY_STATUS } from '../constants/deliveryStatus.js';
import logger from '../config/logger.js';

async function ingestEvent({ topic, payload }) {
  const subscribers = await findActiveSubscribersForTopic(topic);

  const { event, deliveryAttempts } = await prisma.$transaction(async (tx) => {
    const createdEvent = await tx.event.create({ data: { topic, payload } });

    const createdAttempts = await Promise.all(
      subscribers.map((sub) =>
        tx.deliveryAttempt.create({
          data: {
            eventId: createdEvent.id,
            subscriberId: sub.id,
            status: DELIVERY_STATUS.QUEUED,
          },
        }),
      ),
    );

    return { event: createdEvent, deliveryAttempts: createdAttempts };
  });

  await Promise.all(
    deliveryAttempts.map((attempt) =>
      enqueueDelivery({
        deliveryAttemptId: attempt.id,
        eventId: event.id,
        subscriberId: attempt.subscriberId,
      }),
    ),
  );

  logger.info(
    { eventId: event.id, topic, subscriberCount: subscribers.length },
    'Event ingested and fanned out',
  );

  return { event, fanOutCount: subscribers.length };
}

async function getEventById(eventId) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: { deliveryAttempts: true },
  });
}

async function listEvents({ topic, limit = 50, cursor } = {}) {
  return prisma.event.findMany({
    where: topic ? { topic } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
  });
}

export const eventService = {
  ingestEvent,
  getEventById,
  listEvents,
};