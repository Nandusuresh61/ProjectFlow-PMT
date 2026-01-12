// src/enums/ErrorCode.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["AUTH"] = "Authentication Error";
  ErrorCode2["EMAIL_SEND_FAILED"] = "Email send failed!";
  ErrorCode2["EMAIL_SERVICE_UNAVAILABLE"] = "Email Service Unavailable!";
  ErrorCode2["OTP_RESEND_COOLDOWN"] = "OTP_RESEND_COOLDOWN";
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
  constructor(errorCode, message, statusCode) {
    super(message);
  }
};

// src/messages/AuthErrorMessages.ts
var AuthErrorMessages = {
  EMAIL_EXISTS: "The given email already exists! please try a different one",
  OTP_ERROR: "Otp Invalid or Expired",
  OTP_ATTEMPT: "TOO many Invalid Attempt",
  OTP_RESEND_COOLDOWN: "Please wait before requesting a new OTP"
};

// src/messages/EmailMessages.ts
var EmailMessages = {
  EMAIL_SENT_SUCESS: "Email sent successfully",
  EMAIL_SENT_FAILED: "Unable to sent Email!",
  OTP_EMAIL_SUBJECT: "Your OTP Code",
  RESET_PASSOWRD_SUBJECT: "Reset your password"
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

// src/schema/auth/registerUserSchema.ts
import { z as z2 } from "zod";
var RegisterUserSchema = z2.object({
  fullName: z2.string().min(3, "Fullname must be atleast 3 letters!"),
  email: z2.string().email("Invalid Email Address!"),
  password: z2.string().min(8, "Password must be atleast 8 characters!")
});
export {
  AppError,
  AuthErrorMessages,
  EmailMessages,
  EmailType,
  ErrorCode,
  HttpStatusCode,
  RegisterUserSchema,
  TokenEnums,
  TokenPayloadSchema
};
