import { UserModel, UserDoc } from "../database/models/MongoUserModel";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { User } from "@/domain/entities/User";

export class MongoUserRepository
  extends MongoBaseRepository<UserDoc>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    let user = await this.findOne({ email });
    return user;
  }
  async createUser(user: User): Promise<User> {
    let newUser = await this.create(user);
    return newUser;
  }
  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    await this.model.updateOne(
      { email },
      {
        $set: {
          passwordHash: passwordHash,
          updatedAt: new Date(),
        },
      },
    );
  }
}
