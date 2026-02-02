import { ResetPasswordRequestDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IResetPasswordOtpStore } from "@/application/interfaces/use-cases/cache/IResetPasswordOtpStore";
import { IResetPasswordUseCase } from "@/application/interfaces/use-cases/User/IResetPasswordUseCase";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _resetPasswordOtpStore: IResetPasswordOtpStore,
    private readonly _passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: ResetPasswordRequestDto): Promise<void> {
    const MAX_RESET_PASSWORD_ATTEMPTS = 5;
    const { email, otp, newPassword } = dto;

    const otpData = await this._resetPasswordOtpStore.get(email);

    if (!otpData) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_INVALID_OR_EXPIRED,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    if (otpData.attempt >= MAX_RESET_PASSWORD_ATTEMPTS) {
      await this._resetPasswordOtpStore.delete(email);
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_MAX_ATTEMPTS_REACHED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const isOtpValid = await this._passwordHasher.comparePassword(
      otp,
      otpData.otpHash,
    );

    if (!isOtpValid) {
      otpData.attempt += 1;

      await this._resetPasswordOtpStore.update(email, otpData, 300);

      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_INVALID_OR_EXPIRED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const passwordHash =
      await this._passwordHasher.createHashPassword(newPassword);

    await this._userRepo.updatePasswordByEmail(email, passwordHash);

    await this._resetPasswordOtpStore.delete(email);
  }
}
