import { IOtpStore,PendingRegistration } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { redisClient } from "./redisClient";

export class RedisOtpStore implements IOtpStore {
  private getKey(email: string) {
    return `register:${email}`;
  }

  async save(
    email: string,
    data: PendingRegistration,
    ttlSeconds: number
  ): Promise<void> {
    await redisClient.set(
      this.getKey(email),
      JSON.stringify(data),
      { EX: ttlSeconds }
    );
  }

  async get(email: string): Promise<PendingRegistration | null> {
    const value = await redisClient.get(this.getKey(email));
    if (!value) return null;

    return JSON.parse(
      typeof value === "string" ? value : value.toString()
    );
  }

  async update(
    email: string,
    data: PendingRegistration,
    ttlSeconds: number
  ): Promise<void> {
    await this.save(email, data, ttlSeconds);
  }

  async delete(email: string): Promise<void> {
    await redisClient.del(this.getKey(email));
  }
}
