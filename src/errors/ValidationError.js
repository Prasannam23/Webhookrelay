import { AppError } from "../errors/AppError.js";

export class ValidationError extends AppError{
    constructor(details){
        super('Validaion failed',404,details)
    }
}