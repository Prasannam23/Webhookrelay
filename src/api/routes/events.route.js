import express from 'express';
import eventsController from '../controllers/event.controller.js';
import {requireAuth} from '../middlewares/auth.middleware.js';
import {validate} from '../middlewares/validate.middleware.js';
import { ingestionLimiter, dashboardLimiter } from '../middlewares/ratelimiter.middleware.js';
import {eventsSchema} from '../validators/events.schema.js';

import { idParam } from '../validators/common.schema.js';

const router = express.Router();


router.post('/', ingestionLimiter, validate({ body: eventsSchema.ingest }), eventsController.ingest);

router.get('/', requireAuth, dashboardLimiter, validate({ query: eventsSchema.listQuery }), eventsController.list);
router.get('/:id', requireAuth, dashboardLimiter, validate({ params: idParam }), eventsController.getOne);

export default router;