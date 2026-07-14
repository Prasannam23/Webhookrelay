import express from 'express';
import subscribersController from '../controllers/subscriber.controller.js';
import {requireAuth} from '../middlewares/auth.middleware.js';
import { validate} from '../middlewares/validate.middleware.js';
import { dashboardLimiter } from '../middlewares/ratelimiter.middleware.js';
import { subscribersSchema } from '../validators/subscribers.schema.js';


const router = express.Router();

router.use(requireAuth, dashboardLimiter);

router.post('/', validate({ body: subscribersSchema.create }), subscribersController.create);
router.get('/', subscribersController.list);
router.get('/:id', validate({ params: subscribersSchema.idParam }), subscribersController.getOne);
router.patch(
  '/:id',
  validate({ params: subscribersSchema.idParam, body: subscribersSchema.update }),
  subscribersController.update,
);
router.delete('/:id', validate({ params: subscribersSchema.idParam }), subscribersController.remove);
router.post(
  '/:id/regenerate-secret',
  validate({ params: subscribersSchema.idParam }),
  subscribersController.regenerateSecret,
);

export default router;