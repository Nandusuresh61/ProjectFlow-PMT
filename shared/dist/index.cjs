"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AppError: () => AppError,
  AppMessages: () => AppMessages,
  AuthProvider: () => AuthProvider,
  CompleteOnboardingSchema: () => CompleteOnboardingSchema,
  CreateInvitationSchema: () => CreateInvitationSchema,
  CreatePlanSchema: () => CreatePlanSchema,
  EmailType: () => EmailType,
  ErrorCode: () => ErrorCode,
  ForgotEmailSchema: () => ForgotEmailSchema,
  HttpStatusCode: () => HttpStatusCode,
  InvitationStatus: () => InvitationStatus,
  LoginUserSchema: () => LoginUserSchema,
  RegisterUserSchema: () => RegisterUserSchema,
  ResetPasswordSchema: () => ResetPasswordSchema,
  ResponseHandler: () => ResponseHandler,
  TokenEnums: () => TokenEnums,
  TokenPayloadSchema: () => TokenPayloadSchema,
  WorkspaceRoleEnum: () => WorkspaceRoleEnum
});
module.exports = __toCommonJS(index_exports);

// src/enums/ErrorCode.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["AUTH"] = "Authentication Error";
  ErrorCode2["PLAN"] = "Plan Error";
  ErrorCode2["CONFLICT"] = "Conflit";
  ErrorCode2["ONBOARDING"] = "Onboarding Error";
  ErrorCode2["EMAIL_SEND_FAILED"] = "Email send failed!";
  ErrorCode2["EMAIL_SERVICE_UNAVAILABLE"] = "Email Service Unavailable!";
  ErrorCode2["OTP_RESEND_COOLDOWN"] = "OTP_RESEND_COOLDOWN";
  ErrorCode2["RESOURCE_NOT_FOUND"] = "Resource Not Found";
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

// src/enums/WorkspaceRolesEnum.ts
var WorkspaceRoleEnum = /* @__PURE__ */ ((WorkspaceRoleEnum2) => {
  WorkspaceRoleEnum2["WORKSPACE_ADMIN"] = "WORKSPACE_ADMIN";
  WorkspaceRoleEnum2["MEMBER"] = "MEMBER";
  return WorkspaceRoleEnum2;
})(WorkspaceRoleEnum || {});

// src/enums/AuthProviders.ts
var AuthProvider = /* @__PURE__ */ ((AuthProvider2) => {
  AuthProvider2["LOCAL"] = "LOCAL";
  AuthProvider2["GOOGLE"] = "GOOGLE";
  return AuthProvider2;
})(AuthProvider || {});

// src/enums/InvitationStatusEnum.ts
var InvitationStatus = /* @__PURE__ */ ((InvitationStatus2) => {
  InvitationStatus2["PENDING"] = "PENDING";
  InvitationStatus2["ACCEPTED"] = "ACCEPTED";
  InvitationStatus2["EXPIRED"] = "EXPIRED";
  InvitationStatus2["CANCELLED"] = "CANCELLED";
  return InvitationStatus2;
})(InvitationStatus || {});

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
  USER_NOT_FOUND: "User not found.",
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
  PLAN_NAME_ALREADY_EXISTS: "Plan name already exists",
  PLAN_CREATED: "Plan Created Successful.",
  PLAN_NOT_FOUND: "Plan not found.",
  PLAN_STATUS_UPDATED: "Plan Status updated.",
  ONBOARDING_COMPLETED: "Onboarding completed successfully",
  USER_ALREADY_ONBOARDED: "User already completed onboarding",
  USER_FETCHING_SUCCESSFUL: "User Fetching Successfull",
  WORKSPACE_NOT_FOUND: "Workspace not found",
  INVITATION_SENT_SUCCESS: "Invitation sent success",
  INVITATION_ALREADY_SENT: " Invitation already sent to this email",
  MEMBER_LIMIT_EXCEEDED: "Members limit Already Exceeded",
  USER_ALREADY_MEMBER: "User Already Member in this workspace"
};

// src/schema/TokenPayload.ts
var import_zod = __toESM(require("zod"), 1);
var TokenPayloadSchema = import_zod.default.object({
  userId: import_zod.default.string(),
  fullName: import_zod.default.string(),
  email: import_zod.default.string(),
  isSuperAdmin: import_zod.default.boolean(),
  type: import_zod.default.enum(TokenEnums)
});

// src/schema/auth/RegisterUserSchema.ts
var import_zod2 = require("zod");
var RegisterUserSchema = import_zod2.z.object({
  fullName: import_zod2.z.string().trim().min(3, "Full name must be at least 3 characters").max(50, "Full name must not exceed 50 characters").regex(
    /^[A-Za-z ]+$/,
    "Full name can contain only letters and spaces"
  ),
  email: import_zod2.z.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  password: import_zod2.z.string().min(8, "Password must be at least 8 characters").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  ).regex(/^\S*$/, "Password must not contain spaces")
});

// src/schema/auth/LoginUserSchema.ts
var import_zod3 = require("zod");
var LoginUserSchema = import_zod3.z.object({
  email: import_zod3.z.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  password: import_zod3.z.string().min(1, "Password is required").max(64, "Password is too long")
});

// src/schema/auth/ForgotEmailSchema.ts
var import_zod4 = __toESM(require("zod"), 1);
var ForgotEmailSchema = import_zod4.default.object({
  email: import_zod4.default.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase())
});

// src/schema/auth/ResetPasswordSchema.ts
var import_zod5 = __toESM(require("zod"), 1);
var ResetPasswordSchema = import_zod5.default.object({
  email: import_zod5.default.string().trim().email("Invalid email address").transform((email2) => email2.toLowerCase()),
  otp: import_zod5.default.string().length(6, "OTP must be 6 digits"),
  password: import_zod5.default.string().min(8, "Password must be at least 8 characters").max(64, "Password must not exceed 64 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  ).regex(/^\S*$/, "Password must not contain spaces")
});

// src/schema/plan/PlanSchema.ts
var import_zod6 = require("zod");
var CreatePlanSchema = import_zod6.z.object({
  name: import_zod6.z.string({ message: "Plan name is required" }).min(1, "Plan name is required"),
  priceMonthly: import_zod6.z.number({ message: "Price is required" }).min(0, "Price cannot be negative"),
  description: import_zod6.z.string({ message: "Description is required" }).min(1, "Description is required"),
  maxProjects: import_zod6.z.number({ message: "Max projects count is required" }).min(0, "Max projects cannot be negative"),
  maxMembers: import_zod6.z.number({ message: "Max members count is required" }).min(0, "Max members cannot be negative"),
  features: import_zod6.z.array(import_zod6.z.string().min(1), { message: "Features are required" }).min(1, "At least one feature is required")
});

// src/schema/onboarding/CompleteOnboardingSchema.ts
var import_zod7 = require("zod");
var CompleteOnboardingSchema = import_zod7.z.object({
  workspaceName: import_zod7.z.string().trim().min(2, "Workspace name must be at least 2 characters").max(100, "Workspace name cannot exceed 100 characters"),
  planId: import_zod7.z.string().trim().min(1, "Plan ID is required")
});

// src/schema/invitation/CreateInvitationSchema.ts
var import_zod8 = require("zod");
var CreateInvitationSchema = import_zod8.z.object({
  email: import_zod8.z.string().email(),
  role: import_zod8.z.nativeEnum(WorkspaceRoleEnum)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppError,
  AppMessages,
  AuthProvider,
  CompleteOnboardingSchema,
  CreateInvitationSchema,
  CreatePlanSchema,
  EmailType,
  ErrorCode,
  ForgotEmailSchema,
  HttpStatusCode,
  InvitationStatus,
  LoginUserSchema,
  RegisterUserSchema,
  ResetPasswordSchema,
  ResponseHandler,
  TokenEnums,
  TokenPayloadSchema,
  WorkspaceRoleEnum
});
