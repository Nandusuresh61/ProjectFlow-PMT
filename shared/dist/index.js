// src/enums/ErrorCode.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["AUTH"] = "Authentication Error";
  ErrorCode2["EMAIL_SEND_FAILED"] = "Email send failed!";
  ErrorCode2["EMAIL_SERVICE_UNAVAILABLE"] = "Email Service Unavailable!";
  ErrorCode2["OTP_RESEND_COOLDOWN"] = "OTP_RESEND_COOLDOWN";
  ErrorCode2["ONBOARDING"] = "ONBOARDING_ERROR";
  ErrorCode2["WORKSPACE"] = "WORKSPACE_ERROR";
  return ErrorCode2;
})(ErrorCode || {});

// src/enums/HttpStatusCodes.ts
var HttpStatusCode = /* @__PURE__ */ ((HttpStatusCode2) => {
  HttpStatusCode2[HttpStatusCode2["OK"] = 200] = "OK";
  HttpStatusCode2[HttpStatusCode2["CREATED"] = 201] = "CREATED";
  HttpStatusCode2[HttpStatusCode2["ACCEPTED"] = 202] = "ACCEPTED";
  HttpStatusCode2[HttpStatusCode2["NO_CONTENT"] = 204] = "NO_CONTENT";
  HttpStatusCode2[HttpStatusCode2["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
  HttpStatusCode2[HttpStatusCode2["FOUND"] = 302] = "FOUND";
  HttpStatusCode2[HttpStatusCode2["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
  HttpStatusCode2[HttpStatusCode2["BAD_REQUEST"] = 400] = "BAD_REQUEST";
  HttpStatusCode2[HttpStatusCode2["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  HttpStatusCode2[HttpStatusCode2["FORBIDDEN"] = 403] = "FORBIDDEN";
  HttpStatusCode2[HttpStatusCode2["NOT_FOUND"] = 404] = "NOT_FOUND";
  HttpStatusCode2[HttpStatusCode2["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
  HttpStatusCode2[HttpStatusCode2["CONFLICT"] = 409] = "CONFLICT";
  HttpStatusCode2[HttpStatusCode2["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
  HttpStatusCode2[HttpStatusCode2["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
  HttpStatusCode2[HttpStatusCode2["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
  HttpStatusCode2[HttpStatusCode2["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
  HttpStatusCode2[HttpStatusCode2["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
  HttpStatusCode2[HttpStatusCode2["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
  HttpStatusCode2[HttpStatusCode2["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
  return HttpStatusCode2;
})(HttpStatusCode || {});

// src/enums/TokenEnums.ts
var TokenEnums = /* @__PURE__ */ ((TokenEnums2) => {
  TokenEnums2["ACCESS_TOKEN"] = "Access Token";
  TokenEnums2["REFRESH_TOKEN"] = "Refresh Token";
  return TokenEnums2;
})(TokenEnums || {});

// src/enums/EmailEnums.ts
var EmailType = /* @__PURE__ */ ((EmailType2) => {
  EmailType2["OTP"] = "OTP";
  EmailType2["RESET_PASSWORD"] = "RESET_PASSWORD";
  EmailType2["INVITE_USER"] = "INVITE_USER";
  return EmailType2;
})(EmailType || {});

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  errorCode;
  isOperational;
  constructor(errorCode, message, statusCode) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/messages/AppMessages.ts
var AppMessages = {
  EMAIL_ALREADY_EXISTS: "The given email already exists. Please try a different one.",
  INVALID_EMAIL: "Invalid email address.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  INVALID_AUTH_PROVIDER: "Invalid Auth Provider.",
  INVALID_GOOGLE_TOKEN: "Invalid Google Token.",
  INVALID_GOOGLE_PAYLOAD: "Invalid Google Payload",
  INVALID_GOOGLE_CODE: "Invalid Google Auth Code.",
  GOOGLE_AUTH_FAILED: "Google authentication failed.",
  OTP_INVALID_OR_EXPIRED: "OTP is invalid or has expired.",
  OTP_MAX_ATTEMPTS_REACHED: "Too many invalid OTP attempts. Please try again later.",
  OTP_RESEND_COOLDOWN: "Please wait before requesting a new OTP.",
  UNAUTHORIZED_ACCESS: "You are not authorized to perform this action.",
  TOKEN_EXPIRED: "Session expired. Please login again.",
  TOKEN_INVALID: "Invalid authentication token.",
  TOKEN_REFRESH_INVALID: "Invalid Refresh Token.",
  OTP_SENT: "OTP has been sent to your email.",
  OTP_RESENT: "OTP has been resent successfully.",
  EMAIL_VERIFIED: "Email verified successfully.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",
  PASSWORD_RESET_SUCCESS: "Password reset successful.",
  EMAIL_SENT_SUCCESS: "Email sent successfully.",
  EMAIL_SENT_FAILED: "Unable to send email at the moment.",
  EMAIL_SUBJECT_OTP: "Your OTP Code",
  EMAIL_SUBJECT_RESEND_OTP: "Your Resend OTP Code",
  EMAIL_SUBJECT_RESET_PASSWORD: "Reset your password",
  EMAIL_SUBJECT_INVITE_USER: "You have been invited",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
  VALIDATION_FAILED: "Invalid input data.",
  RESOURCE_NOT_FOUND: "Requested resource not found.",
  OPERATION_SUCCESS: "Operation completed successfully.",
  ONBOARDING_COMPLETE: "Onboarding completed successfully",
  WORKSPACE_CREATED: "Workspace created successfully",
  ONBOARDING_ALREADY_DONE: "Onboarding already completed"
};

// src/schema/TokenPayload.ts
import z from "zod";
var TokenPayloadSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  isSuperAdmin: z.boolean(),
  type: z.enum(TokenEnums)
});

// src/schema/auth/RegisterUserSchema.ts
import { z as z2 } from "zod";
var RegisterUserSchema = z2.object({
  fullName: z2.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Full name must not exceed 50 characters").regex(
    /^[A-Za-z ]+$/,
    "Full name can contain only letters and spaces"
  ),
  email: z2.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  password: z2.string().min(8, "Password must be at least 8 characters").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  ).regex(/^\S*$/, "Password must not contain spaces")
});

// src/schema/auth/LoginUserSchema.ts
import { z as z3 } from "zod";
var LoginUserSchema = z3.object({
  email: z3.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  password: z3.string().min(1, "Password is required").max(64, "Password is too long")
});

// src/schema/auth/ForgotEmailSchema.ts
import z4 from "zod";
var ForgotEmailSchema = z4.object({
  email: z4.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase())
});

// src/schema/auth/ResetPasswordSchema.ts
import z5 from "zod";
var ResetPasswordSchema = z5.object({
  email: z5.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  otp: z5.string().length(6, "OTP must be 6 digits"),
  password: z5.string().min(8, "Password must be at least 8 characters").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  ).regex(/^\S*$/, "Password must not contain spaces")
});

// src/schema/onboarding/OnboardingSchema.ts
import { z as z6 } from "zod";
var TeamInviteSchema = z6.object({
  email: z6.string().email(),
  role: z6.enum(["Admin", "Member"])
});
var CompleteOnboardingSchema = z6.object({
  workspaceName: z6.string().min(3).max(50),
  plan: z6.enum(["free", "pro", "enterprise"]),
  teamInvites: z6.array(TeamInviteSchema).optional().default([])
});

// src/response/responseHandler.ts
var ResponseHandler = {
  success(message, data) {
    return {
      success: true,
      message,
      ...data && { data }
    };
  },
  error(message) {
    return {
      success: false,
      message
    };
  }
};
export {
  AppError,
  AppMessages,
  CompleteOnboardingSchema,
  EmailType,
  ErrorCode,
  ForgotEmailSchema,
  HttpStatusCode,
  LoginUserSchema,
  RegisterUserSchema,
  ResetPasswordSchema,
  ResponseHandler,
  TeamInviteSchema,
  TokenEnums,
  TokenPayloadSchema
};
