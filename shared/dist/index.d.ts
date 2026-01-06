import z from 'zod';

declare enum ErrorCode {
    AUTH = "Authentication Error"
}

declare enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

declare enum TokenEnums {
    ACCESS_TOKEN = "Access Token",
    REFRESH_TOKEN = "Refresh Token"
}

declare class AppError extends Error {
    constructor(errorCode: ErrorCode, message: string, statusCode: HttpStatusCode);
}

declare const AuthErrorMessages: {
    EMAIL_EXISTS: string;
};

declare const TokenPayloadSchema: z.ZodObject<{
    userId: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    isSuperAdmin: z.ZodBoolean;
    type: z.ZodEnum<typeof TokenEnums>;
}, z.core.$strip>;
type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;

export { AppError, AuthErrorMessages, ErrorCode, HttpStatusCode, TokenEnums, TokenPayloadSchema, type TokenPayloadType };
