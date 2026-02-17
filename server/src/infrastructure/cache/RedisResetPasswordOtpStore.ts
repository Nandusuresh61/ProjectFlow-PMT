import {
  IResetPasswordOtpStore,
  PendingPasswordReset,
} from "@/application/interfaces/use-cases/cache/IResetPasswordOtpStore";
import { redisClient } from "./redisClient";
export class RedisResetPasswordOtpStore implements IResetPasswordOtpStore {
  private getKey(email: string) {
    return `reset-password:${email}`;
  }

  async save(
    email: string,
    data: PendingPasswordReset,
    ttlSeconds: number,
  ): Promise<void> {
    await redisClient.set(this.getKey(email), JSON.stringify(data), {
      EX: ttlSeconds,
    });
  }

  async get(email: string): Promise<PendingPasswordReset | null> {
    const value = await redisClient.get(this.getKey(email));
    if (!value) return null;
    return JSON.parse(typeof value === "string" ? value : value.toString());
  }

  async update(
    email: string,
    data: PendingPasswordReset,
    ttlSeconds: number,
  ): Promise<void> {
    await this.save(email, data, ttlSeconds);
  }

  async delete(email: string): Promise<void> {
    await redisClient.del(this.getKey(email));
  }
}
