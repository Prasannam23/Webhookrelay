// src/api/validators/subscribers.schema.js
import z from "zod";
import { TOPIC_VALUES } from "../../constants/index.js";
import { idParam } from "./common.schema.js";

const create = z.object({
  name: z.string().min(1).max(100),
  targetUrl: z.string().url(),
  topics: z.array(z.enum(TOPIC_VALUES)).min(1, 'At least one topic is required'),
});

const update = z.object({
  name: z.string().min(1).max(100).optional(),
  targetUrl: z.string().url().optional(),
  topics: z.array(z.enum(TOPIC_VALUES)).min(1).optional(),
  isActive: z.boolean().optional(),
});

export const subscribersSchema = { create, update, idParam };