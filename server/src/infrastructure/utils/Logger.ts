import winston from "winston";
const { combine, timestamp, printf, colorize, json } = winston.format;

// Log text format for dev mode
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

// Log text format for prod
const prodFormat = combine(timestamp(), json());

const isProduction = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: isProduction ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});