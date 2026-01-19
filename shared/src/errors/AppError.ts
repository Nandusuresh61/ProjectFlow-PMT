import { ErrorCode } from "../enums";
import { HttpStatusCode } from "../enums/HttpStatusCodes";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    errorCode: ErrorCode,
    message: string,
    statusCode: HttpStatusCode
  ) {
    super(message);

    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
