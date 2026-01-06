import bcrypt from "bcrypt";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";

export class PasswordHash implements IPasswordHasher {
  private readonly saltRounds = 10;

  async createHashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
