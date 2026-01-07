import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { UserModel } from "../database/modals/MongoUserModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { User } from "@/domain/entities/User";

export class MongoUserRepostory
  extends MongoBaseRepository
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    let user = await this.findOne({email});
    return user;
  }
  async createUser(user: User): Promise<User> {
    let newUser = await this.create(user);
    return newUser

  }
}



