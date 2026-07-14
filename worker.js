import createDeliveryWorker from './src/queue/delivery.worker.js';
import logger from './src/config/logger.js';
import {prisma} from './src/db/client.js';

const worker = createDeliveryWorker();
logger.info('Delivery worker started, waiting for jobs...');

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down worker gracefully...`);
  await worker.close();
  await prisma.$disconnect();
  logger.info('Worker shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection in worker');
});