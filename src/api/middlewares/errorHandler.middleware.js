import logger from "../../config/logger.js";
import {env} from "../../config/env.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  const logPayload = {
    requestId: req.id,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    message: { message: err.message, stack: err.stack },
  };

  if (statusCode >= 500) {
    logger.error(logPayload, 'UNhandled error');
  } else {
    logger.warn(logPayload, 'Request error');
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Internal server error',
    ...(err.details && { details: err.details }),
    ...(env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
  });
}