import { UpdateUserProfileDto } from "@/application/dtos/UserProfileDto";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IUpdateUserProfileUseCase } from "@/application/interfaces/use-cases/User/IUpdateUserProfileUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class UpdatUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}
  async execute(userId: string, data: UpdateUserProfileDto): Promise<void> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (data.fullName !== undefined) {
      user.fullName = data.fullName;
    }

    if (data.profileImage !== undefined) {
      user.profileImage = data.profileImage;
    }

    user.updatedAt = new Date();

    await this._userRepo.update(user)
  }
}
