import { AppError } from "../errors/AppError.js";

export class NotFoundError extends AppError{
    constructor(resources='Resources'){
        super('${resource} not found',404)
    }
}