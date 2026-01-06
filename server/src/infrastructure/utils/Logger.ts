import winston from "winston";
import { config } from "@/app.config";
const { combine, timestamp, printf, colorize, json } = winston.format;

//log text format for dev mode
const devFormat = combine(
  colorize(),
  timestamp(),
  printf((info) => {
    const { level, message, timestamp, ...meta } = info as {
      level: string;
      message: unknown;
      timestamp: string;
      [key: string]: unknown;
    };

    const safeMessage =
      typeof message === "string" ? message : JSON.stringify(message);

    return `${timestamp} [${level}]: ${safeMessage} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  })
);

//log text format for prod
const prodFormat = combine(timestamp(), json());

export const logger = winston.createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: config.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    // Later: add file transport, Loki transport, etc.
  ],
});