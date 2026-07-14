import {eventService} from '../../services/event.service.js';
import {asyncHandler} from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

const ingest = asyncHandler(async (req, res) => {
  const { topic, payload } = req.body;
  const { event, fanOutCount } = await eventService.ingestEvent({ topic, payload });
  return sendSuccess(res, {
    statusCode: 202,
    data: { eventId: event.id, topic: event.topic, fanOutCount },
    message: `Event accepted and queued for ${fanOutCount} subscriber(s)`,
  });
});

const list = asyncHandler(async (req, res) => {
  const events = await eventService.listEvents(req.query);
  return sendSuccess(res, { data: events });
});

const getOne = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  return sendSuccess(res, { data: event });
});

export default { ingest, list, getOne };