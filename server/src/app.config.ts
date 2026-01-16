import dotenv from "dotenv";

dotenv.config();

export const config = {
  FRONTEND_BASE_URL: process.env.VITE_FRONTED_BASE_URL || "http://localhost:5173",
  dbUrl:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ProjectManagementT",
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "super_secret_access_key",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "super_secret_refresh_key",
  PORT: process.env.PORT || 8080,
  NODE_ENV:process.env.NODE_ENV || "development",
  RedisURL: process.env.REDIS_URL
};
