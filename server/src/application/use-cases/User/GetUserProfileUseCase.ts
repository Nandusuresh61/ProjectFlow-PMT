import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetUserProfileUseCase } from "@/application/interfaces/use-cases/User/IGetUserProfileUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(userId: string): Promise<{
    userId: string;
    fullName: string;
    email: string;
    profileImage: string | null;
  }> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage || "",
    };
  }
}
