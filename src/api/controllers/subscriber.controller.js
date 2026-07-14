// src/api/controllers/subscriber.controller.js
import {
  createSubscriber,
  listSubscribers,
  getSubscriberById,
  getDecryptedSecret,
  updateSubscriber,
  deleteSubscriber,
  regenerateSecret as regenerateSecretService,
  findActiveSubscribersForTopic,
} from '../../services/subscriber.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

const create = asyncHandler(async (req, res) => {
  const result = await createSubscriber({
    userId: req.user.id,
    ...req.body,
  });

  return sendSuccess(res, {
    statusCode: 201,
    data: result,
    message: 'Save this secret now — it will not be shown again.',
  });
});

const list = asyncHandler(async (req, res) => {
  const subscribers = await listSubscribers(req.user.id);
  return sendSuccess(res, { data: subscribers });
});

const getOne = asyncHandler(async (req, res) => {
  const subscriber = await getSubscriberById(req.user.id, req.params.id);
  const { secret, ...safe } = subscriber;
  return sendSuccess(res, { data: safe });
});

const update = asyncHandler(async (req, res) => {
  const updated = await updateSubscriber(req.user.id, req.params.id, req.body);
  const { secret, ...safe } = updated;
  return sendSuccess(res, { data: safe });
});

const remove = asyncHandler(async (req, res) => {
  await deleteSubscriber(req.user.id, req.params.id);
  return sendSuccess(res, { statusCode: 204, data: null });
});

const regenerateSecret = asyncHandler(async (req, res) => {
  const rawSecret = await regenerateSecretService(req.user.id, req.params.id);
  return sendSuccess(res, {
    data: { secret: rawSecret },
    message: 'Save this secret now — it will not be shown again.',
  });
});

export default { create, list, getOne, update, remove, regenerateSecret };