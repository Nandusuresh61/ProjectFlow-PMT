import z, { z as z$1 } from 'zod';

declare enum ErrorCode {
    AUTH = "Authentication Error",
    PLAN = "Plan Error",
    CONFLICT = "Conflit",
    ONBOARDING = "Onboarding Error",
    EMAIL_SEND_FAILED = "Email send failed!",
    EMAIL_SERVICE_UNAVAILABLE = "Email Service Unavailable!",
    OTP_RESEND_COOLDOWN = "OTP_RESEND_COOLDOWN",
    RESOURCE_NOT_FOUND = "Resource Not Found",
    INVALID_OPERATION = "Invalid Operat"
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

declare enum WorkspaceRoleEnum {
    WORKSPACE_ADMIN = "WORKSPACE_ADMIN",
    MEMBER = "MEMBER"
}

declare enum AuthProvider {
    LOCAL = "LOCAL",
    GOOGLE = "GOOGLE"
}

declare enum InvitationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}

declare class AppError extends Error {
    readonly statusCode: HttpStatusCode;
    readonly errorCode: ErrorCode;
    readonly isOperational: boolean;
    constructor(errorCode: ErrorCode, message: string, statusCode: HttpStatusCode);
}

declare const AppMessages: {
    readonly EMAIL_ALREADY_EXISTS: "The given email already exists. Please try a different one.";
    readonly INVALID_EMAIL: "Invalid email address.";
    readonly INVALID_CREDENTIALS: "Invalid email or password.";
    readonly INVALID_AUTH_PROVIDER: "Invalid Auth Provider.";
    readonly INVALID_GOOGLE_TOKEN: "Invalid Google Token.";
    readonly INVALID_GOOGLE_PAYLOAD: "Invalid Google Payload";
    readonly INVALID_GOOGLE_CODE: "Invalid Google Auth Code.";
    readonly GOOGLE_AUTH_FAILED: "Google authentication failed.";
    readonly OTP_INVALID_OR_EXPIRED: "OTP is invalid or has expired.";
    readonly OTP_MAX_ATTEMPTS_REACHED: "Too many invalid OTP attempts. Please try again later.";
    readonly OTP_RESEND_COOLDOWN: "Please wait before requesting a new OTP.";
    readonly UNAUTHORIZED_ACCESS: "You are not authorized to perform this action.";
    readonly USER_NOT_FOUND: "User not found.";
    readonly TOKEN_EXPIRED: "Session expired. Please login again.";
    readonly TOKEN_INVALID: "Invalid authentication token.";
    readonly TOKEN_REFRESH_INVALID: "Invalid Refresh Token.";
    readonly OTP_SENT: "OTP has been sent to your email.";
    readonly OTP_RESENT: "OTP has been resent successfully.";
    readonly EMAIL_VERIFIED: "Email verified successfully.";
    readonly LOGIN_SUCCESS: "Login successful.";
    readonly LOGOUT_SUCCESS: "Logout successful.";
    readonly PASSWORD_RESET_SUCCESS: "Password reset successful.";
    readonly EMAIL_SENT_SUCCESS: "Email sent successfully.";
    readonly EMAIL_SENT_FAILED: "Unable to send email at the moment.";
    readonly EMAIL_SUBJECT_OTP: "Your OTP Code";
    readonly EMAIL_SUBJECT_RESEND_OTP: "Your Resend OTP Code";
    readonly EMAIL_SUBJECT_RESET_PASSWORD: "Reset your password";
    readonly EMAIL_SUBJECT_INVITE_USER: "You have been invited";
    readonly INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.";
    readonly VALIDATION_FAILED: "Invalid input data.";
    readonly RESOURCE_NOT_FOUND: "Requested resource not found.";
    readonly OPERATION_SUCCESS: "Operation completed successfully.";
    readonly PLAN_NAME_ALREADY_EXISTS: "Plan name already exists";
    readonly PLAN_CREATED: "Plan Created Successful.";
    readonly PLAN_NOT_FOUND: "Plan not found.";
    readonly PLAN_STATUS_UPDATED: "Plan Status updated.";
    readonly ONBOARDING_COMPLETED: "Onboarding completed successfully";
    readonly USER_ALREADY_ONBOARDED: "User already completed onboarding";
    readonly USER_FETCHING_SUCCESSFUL: "User Fetching Successfull";
    readonly WORKSPACE_NOT_FOUND: "Workspace not found";
    readonly INVITATION_SENT_SUCCESS: "Invitation sent success";
    readonly INVITATION_ALREADY_SENT: " Invitation already sent to this email";
    readonly INVALID_INVITATION: "Invalid Invitation";
    readonly INVITATION_EXPIRED: "Invitation Expired!";
    readonly INVITATION_ACCEPTED: "Invitation Accepted";
    readonly INVITATION_ALREADY_USED: "Invitation Already Used";
    readonly MEMBER_LIMIT_EXCEEDED: "Members limit Already Exceeded";
    readonly USER_ALREADY_MEMBER: "User Already Member in this workspace";
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
    email: z$1.ZodPipe<z$1.ZodString, z$1.ZodTransform<string, string>>;
    password: z$1.ZodString;
}, z$1.core.$strip>;
type RegisterUserSchemaType = z$1.infer<typeof RegisterUserSchema>;

declare const LoginUserSchema: z$1.ZodObject<{
    email: z$1.ZodPipe<z$1.ZodString, z$1.ZodTransform<string, string>>;
    password: z$1.ZodString;
}, z$1.core.$strip>;
type LoginUserSchemaType = z$1.infer<typeof LoginUserSchema>;

declare const ForgotEmailSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strip>;
type ForgotEmailSchemaType = z.infer<typeof ForgotEmailSchema>;

declare const ResetPasswordSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    otp: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

declare const CreatePlanSchema: z$1.ZodObject<{
    name: z$1.ZodString;
    priceMonthly: z$1.ZodNumber;
    description: z$1.ZodString;
    maxProjects: z$1.ZodNumber;
    maxMembers: z$1.ZodNumber;
    features: z$1.ZodArray<z$1.ZodString>;
}, z$1.core.$strip>;
type CreatePlanSchemaType = z$1.infer<typeof CreatePlanSchema>;

declare const CompleteOnboardingSchema: z$1.ZodObject<{
    workspaceName: z$1.ZodString;
    planId: z$1.ZodString;
}, z$1.core.$strip>;

declare const CreateInvitationSchema: z$1.ZodObject<{
    invites: z$1.ZodArray<z$1.ZodObject<{
        email: z$1.ZodString;
        role: z$1.ZodEnum<typeof WorkspaceRoleEnum>;
    }, z$1.core.$strip>>;
}, z$1.core.$strip>;

type SuccessResponse<T> = {
    success: true;
    message: string;
    data?: T;
};
type ErrorResponse = {
    success: false;
    message: string;
};
declare const ResponseHandler: {
    success<T>(message: string, data?: T): SuccessResponse<T>;
    error(message: string): ErrorResponse;
};

export { AppError, AppMessages, AuthProvider, CompleteOnboardingSchema, CreateInvitationSchema, CreatePlanSchema, type CreatePlanSchemaType, EmailType, ErrorCode, ForgotEmailSchema, type ForgotEmailSchemaType, HttpStatusCode, InvitationStatus, LoginUserSchema, type LoginUserSchemaType, RegisterUserSchema, type RegisterUserSchemaType, ResetPasswordSchema, type ResetPasswordSchemaType, ResponseHandler, TokenEnums, TokenPayloadSchema, type TokenPayloadType, WorkspaceRoleEnum };
