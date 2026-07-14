import express from 'express';
import authRoutes from './auth.routes.js';
import subscribersRoutes from './subscriber.route.js';
import eventsRoutes from './events.route.js';
import healthRoutes from './health.route.js';


const router = express.Router();


router.use('/auth', authRoutes);
router.use('/subscribers', subscribersRoutes);
router.use('/events', eventsRoutes);
router.use('/health', healthRoutes);

export default router;

