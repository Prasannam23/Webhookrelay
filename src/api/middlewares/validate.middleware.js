import { ValidationError } from "../../errors/ValidationError.js";

export function validate(schemas) {
  return (req, res, next) => {
    const errors = {};

    for (const key of ['body', 'query', 'params']) {
      const schema = schemas[key];

      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        errors[key] = result.error.flatten().fieldErrors;
      } else {
        req[key] = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(new ValidationError(errors));
    }

    next();
  };
}