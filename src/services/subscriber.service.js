import crypto from 'crypto';
import {prisma} from '../db/client.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { NotFoundError } from '../errors/NotFoundError.js';

function generateRawSecret() {
  return `whsec_${crypto.randomBytes(24).toString('hex')}`;
}

async function createSubscriber({ userId, name, targetUrl, topics }) {
  const rawSecret = generateRawSecret();

  const subscriber = await prisma.subscriber.create({
    data: {
      userId,
      name,
      targetUrl,
      topics,
      secret: encrypt(rawSecret),
    },
  });

  return { ...subscriber, secret: undefined, rawSecret };
}

async function listSubscribers(userId) {
  const subscribers = await prisma.subscriber.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return subscribers.map(({ secret, ...rest }) => rest);
}

async function getSubscriberById(userId, subscriberId) {
  const subscriber = await prisma.subscriber.findFirst({
    where: { id: subscriberId, userId },
  });
  if (!subscriber) throw new NotFoundError('Subscriber');
  return subscriber;
}

async function getDecryptedSecret(subscriberId) {
  const subscriber = await prisma.subscriber.findUnique({ where: { id: subscriberId } });
  if (!subscriber) throw new NotFoundError('Subscriber');
  return decrypt(subscriber.secret);
}

async function updateSubscriber(userId, subscriberId, updates) {
  await getSubscriberById(userId, subscriberId);
  const { secret, ...safeUpdates } = updates;
  return prisma.subscriber.update({
    where: { id: subscriberId },
    data: safeUpdates,
  });
}

async function deleteSubscriber(userId, subscriberId) {
  await getSubscriberById(userId, subscriberId);
  return prisma.subscriber.delete({ where: { id: subscriberId } });
}

async function regenerateSecret(userId, subscriberId) {
  await getSubscriberById(userId, subscriberId);
  const rawSecret = generateRawSecret();

  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: { secret: encrypt(rawSecret) },
  });

  return rawSecret;
}

async function findActiveSubscribersForTopic(topic) {
  return prisma.subscriber.findMany({
    where: { isActive: true, topics: { has: topic } },
  });
}

export {
  createSubscriber,
  listSubscribers,
  getSubscriberById,
  getDecryptedSecret,
  updateSubscriber,
  deleteSubscriber,
  regenerateSecret,
  findActiveSubscribersForTopic,
};