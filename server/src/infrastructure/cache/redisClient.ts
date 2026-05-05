import { config } from "@/app.config";
import { createClient } from "redis";

export const redisClient = createClient({
  url: config.RedisURL,
});
redisClient.on("error", (error: Error) => {
  console.error("Redis connection error:", error);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
};
