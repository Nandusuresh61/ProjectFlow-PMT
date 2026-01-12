import z, { z as z$1 } from 'zod';

declare enum ErrorCode {
    AUTH = "Authentication Error",
    EMAIL_SEND_FAILED = "Email send failed!",
    EMAIL_SERVICE_UNAVAILABLE = "Email Service Unavailable!",
    OTP_RESEND_COOLDOWN = "OTP_RESEND_COOLDOWN"
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

declare enum EmailType {
    OTP = "OTP",
    RESET_PASSWORD = "RESET_PASSWORD",
    INVITE_USER = "INVITE_USER"
}

declare class AppError extends Error {
    constructor(errorCode: ErrorCode, message: string, statusCode: HttpStatusCode);
}

declare const AuthErrorMessages: {
    EMAIL_EXISTS: string;
    OTP_ERROR: string;
    OTP_ATTEMPT: string;
    OTP_RESEND_COOLDOWN: string;
};

declare const EmailMessages: {
    EMAIL_SENT_SUCESS: string;
    EMAIL_SENT_FAILED: string;
    OTP_EMAIL_SUBJECT: string;
    RESET_PASSOWRD_SUBJECT: string;
};

declare const TokenPayloadSchema: z.ZodObject<{
    userId: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    isSuperAdmin: z.ZodBoolean;
    type: z.ZodEnum<typeof TokenEnums>;
}, z.core.$strip>;
type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;

declare const RegisterUserSchema: z$1.ZodObject<{
    fullName: z$1.ZodString;
    email: z$1.ZodString;
    password: z$1.ZodString;
}, z$1.core.$strip>;
type RegisterUserSchemaType = z$1.infer<typeof RegisterUserSchema>;

export { AppError, AuthErrorMessages, EmailMessages, EmailType, ErrorCode, HttpStatusCode, RegisterUserSchema, type RegisterUserSchemaType, TokenEnums, TokenPayloadSchema, type TokenPayloadType };
