import { NotFoundError } from "../../errors/NotFoundError.js";
export function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
}