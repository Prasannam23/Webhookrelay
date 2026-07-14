import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import {env } from '../config/env.js';
import logger from '../config/logger.js';
import {requestId} from '../api/middlewares/requestid.middleware.js';
import {notFound} from '../api/middlewares/notFound.middleware.js';
import {errorHandler} from '../api/middlewares/errorHandler.middleware.js';
import v1Routes from '../api/routes/index.js';

const app = express();

app.use(requestId);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.id,
    autoLogging: { ignore: (req) => req.url === '/api/v1/health/live' },
  }),
);

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1', v1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;