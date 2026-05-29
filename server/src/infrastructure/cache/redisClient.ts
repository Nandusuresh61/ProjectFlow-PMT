import { config } from "@/app.config";
import { createClient } from "redis";
import { logger } from "@/infrastructure/utils/Logger";

export const redisClient = createClient({
  url: config.RedisURL,
});
redisClient.on("error", (error: Error) => {
  logger.error("Redis connection error:", error);
});

export const connectRedis = async () => {
  await redisClient.connect();
  logger.info("Connected to Redis");
};
