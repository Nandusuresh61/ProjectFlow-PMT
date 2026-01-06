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
  AuthErrorMessages: () => AuthErrorMessages,
  ErrorCode: () => ErrorCode,
  HttpStatusCode: () => HttpStatusCode,
  TokenEnums: () => TokenEnums,
  TokenPayloadSchema: () => TokenPayloadSchema
});
module.exports = __toCommonJS(index_exports);

// src/enums/ErrorCode.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2["AUTH"] = "Authentication Error";
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

// src/errors/AppError.ts
var AppError = class extends Error {
  constructor(errorCode, message, statusCode) {
    super(message);
  }
};

// src/messages/AuthErrorMessages.ts
var AuthErrorMessages = {
  EMAIL_EXISTS: "The given email already exists! please try a different one"
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppError,
  AuthErrorMessages,
  ErrorCode,
  HttpStatusCode,
  TokenEnums,
  TokenPayloadSchema
});
