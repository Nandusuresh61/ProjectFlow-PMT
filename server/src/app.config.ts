import dotenv from "dotenv";

dotenv.config();

export const config = {
  FRONTEND_BASE_URL:
    process.env.VITE_FRONTED_BASE_URL || "http://localhost:5173",
  dbUrl:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ProjectManagementT",
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "super_secret_access_key",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "super_secret_refresh_key",
  PORT: process.env.PORT || 8080,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  REFRESH_TOKEN_PATH: process.env.REFRESH_TOKEN_PATH,
  NODE_ENV: process.env.NODE_ENV || "development",
  RedisURL: process.env.REDIS_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
};
