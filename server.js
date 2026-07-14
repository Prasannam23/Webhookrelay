import http from 'http';
import app from './src/api/app.js';
import {env} from './src/config/env.js';
import logger from './src/config/logger.js';
import {prisma} from './src/db/client.js';
import { initSockets } from './src/sockets/index.js';

const httpServer = http.createServer(app);
initSockets(httpServer);
console.log('BOOT: server.js reached line 1');
const server = httpServer.listen(env.PORT, () => {
  logger.info(`API server listening on port ${env.PORT} (${env.NODE_ENV})`);
});
console.log('BOOT: server.js reached line 1');
async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  console.log('BOOT: server.js reached line 1');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('BOOT: server.js reached line 1');
    logger.info('Shutdown complete');
    process.exit(0);
    console.log('BOOT: server.js reached line 1');
  });
  setTimeout(() => {
    console.log('BOOT: server.js reached line 1');
    logger.error('Forced shutdown after timeout');
    console.log('BOOT: server.js reached line 1');
    process.exit(1);
    console.log('BOOT: server.js reached line 1');
  }, 10_000).unref();
}
console.log('BOOT: server.js reached line 1');
process.on('SIGTERM', () => shutdown('SIGTERM'));
console.log('BOOT: server.js reached line 1');
process.on('SIGINT', () => shutdown('SIGINT'));
console.log('BOOT: server.js reached line 1');
process.on('unhandledRejection', (reason) => {
  console.log('BOOT: server.js reached line 1');
  logger.error({ reason }, 'Unhandled promise rejection');
  console.log('BOOT: server.js reached line 1');
});