// src/routes/auth.routes.js
import express from 'express';
import authController from '../controllers/auth.controller.js';  // no curly braces
import { validate } from '../middlewares/validate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { dashboardLimiter } from '../middlewares/ratelimiter.middleware.js';
import { authSchema } from '../validators/auth.schema.js';

const router = express.Router();

router.post('/register', dashboardLimiter, validate({ body: authSchema.register }), authController.register);
router.post('/login', dashboardLimiter, validate({ body: authSchema.login }), authController.login);
router.get('/me', requireAuth, authController.me);

export default router;