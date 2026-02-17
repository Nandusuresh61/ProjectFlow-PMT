import { config } from "@/app.config";
import { createClient } from "redis";

export const redisClient = createClient({
  url: config.RedisURL,
});
redisClient.on("error", (error) => {
  console.error(" Redis Error: ", error);
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected.");
};
