import { ChangePasswordDto } from "@/application/dtos/UserProfileDto";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IChangePasswordUseCase } from "@/application/interfaces/use-cases/User/IChangePasswordUseCase";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordHash: IPasswordHasher,
  ) {}

  async execute(userId: string, data: ChangePasswordDto): Promise<void> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    const isMatch = await this._passwordHash.comparePassword(
      data.currentPassword,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.CURRENT_PASSWORD_IS_WRONG,
        HttpStatusCode.CONFLICT,
      );
    }
    const passwordHash = await this._passwordHash.createHashPassword(
      data.newPassword,
    );

    user.passwordHash = passwordHash;

    await this._userRepo.update(user);
  }
}
