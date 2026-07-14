import { z } from 'zod';
import { TOPIC_VALUES } from '../../constants/index.js';

 const ingest = z.object({
  topic: z.enum(TOPIC_VALUES),
  payload: z.record(z.any()).refine((val) => Object.keys(val).length > 0, {
    message: 'payload must be a non-empty object',
  }),
});

 const listQuery = z.object({
  topic: z.enum(TOPIC_VALUES).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  cursor: z.string().uuid().optional(),
});

export const eventsSchema = { ingest, listQuery}