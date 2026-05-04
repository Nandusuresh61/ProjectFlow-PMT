import path from "path";
import dotenv from "dotenv";
import { envSchema } from "./shared/schema/EnvSchema/env.schema";

const envPath = path.resolve(__dirname, "../.env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(
    ` Warning: Could not load .env file from ${envPath}. Using system environment variables if available.`,
  );
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Environment validation failed:");
  parsedEnv.error.issues.forEach((issue) => {
    const pathName = issue.path.join(".");
    console.error(`   - ${pathName}: ${issue.message} (${issue.code})`);
  });

  const missingVars = parsedEnv.error.issues
    .filter(
      (i) => i.code === "invalid_type" && (i as { received?: string }).received === "undefined",
    )
    .map((i) => i.path.join("."));

  if (missingVars.length > 0) {
    console.error(`\n Missing variables: ${missingVars.join(", ")}`);
    console.error(
      `Please check your .env file at ${envPath} and ensure these are defined.`,
    );
  }

  process.exit(1);
}

const env = parsedEnv.data;

export const config = {
  FRONTEND_BASE_URL: env.VITE_FRONTEND_BASE_URL,
  dbUrl: env.MONGO_URI,

  ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_PATH: env.REFRESH_TOKEN_PATH,
  PORT: Number(env.PORT) || 8080,

  ACCESS_TOKEN_EXPIRES_IN: env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: env.REFRESH_TOKEN_EXPIRES_IN,

  NODE_ENV: env.NODE_ENV,

  RedisURL: env.REDIS_URL,

  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI,

  ACCESS_TOKEN_COOKIE_MAX_AGE:
    Number(env.ACCESS_TOKEN_COOKIE_MAX_AGE) || 15 * 60 * 1000,

  REFRESH_TOKEN_COOKIE_MAX_AGE:
    Number(env.REFRESH_TOKEN_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,

  RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET || "",
};
