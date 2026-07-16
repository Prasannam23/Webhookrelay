import http from 'http';
import app from './src/api/app.js';
import { env } from './src/config/env.js';
import logger from './src/config/logger.js';
import { prisma } from './src/db/client.js';
import { initSockets } from './src/sockets/index.js';
import createDeliveryWorker from './src/queue/delivery.worker.js';

const httpServer = http.createServer(app);
initSockets(httpServer);

const server = httpServer.listen(env.PORT, () => {
  logger.info(`API server listening on port ${env.PORT} (${env.NODE_ENV})`);
});

// Option A (free-tier deployment): the delivery worker runs inside this
// same process instead of as a separate Render Background Worker, since
// that service type requires a paid plan. With a production budget,
// this should go back to running as `worker.js` in its own process.
const deliveryWorker = createDeliveryWorker();
logger.info('Delivery worker started inside API process (merged for free-tier hosting)');

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);

  server.close(async () => {
    await deliveryWorker.close();
    await prisma.$disconnect();
    logger.info('Shutdown complete');
    process.exit(0);
  });

  // Force-exit if graceful shutdown hangs too long
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection');
});
