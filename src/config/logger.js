import pino from 'pino';
import {env} from './env.js';

const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  // Never log secrets/tokens even if accidentally passed in an object
  redact: {
    paths: ['req.headers.authorization', '*.secret', '*.password', '*.passwordHash'],
    censor: '[REDACTED]',
  },
});

export default logger;