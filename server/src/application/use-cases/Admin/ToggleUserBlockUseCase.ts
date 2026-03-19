import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IToggleUserBlockUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IToggleUserBlockUseCase";

export class ToggleUserBlockUseCase implements IToggleUserBlockUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(userId: string): Promise<boolean> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isBlocked = !user.isBlocked;
    user.updatedAt = new Date();

    await this._userRepo.update(user);
    return user.isBlocked;
  }
}
