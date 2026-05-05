import { z } from "zod";

export const envSchema = z.object({
  VITE_FRONTEND_BASE_URL: z.string().min(1),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_PATH: z.string().min(1),

  PORT: z.string().optional(),

  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  NODE_ENV: z
    .string()
    .transform((val) => val.replace(/['"]/g, ""))
    .optional()
    .default("development")
    .pipe(z.enum(["development", "production", "test"])),

  REDIS_URL: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),

  ACCESS_TOKEN_COOKIE_MAX_AGE: z.string().optional(),
  REFRESH_TOKEN_COOKIE_MAX_AGE: z.string().optional(),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_SECURE: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
});