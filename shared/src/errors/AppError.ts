import { ErrorCode } from "../enums";
import { HttpStatusCode } from "../enums/HttpStatusCodes";

export class AppError extends Error {
    constructor(errorCode: ErrorCode, message: string, statusCode: HttpStatusCode) {
        super(message);
    }

}