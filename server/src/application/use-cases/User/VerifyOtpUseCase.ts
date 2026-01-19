import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { VerifyAuthDto } from "@/application/dtos/AuthDto";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";
import { IRegisterUserUseCase } from "@/application/interfaces/use-cases/User/IRegisterUserUseCase";
import { IVerifyOtpUseCase } from "@/application/interfaces/use-cases/User/IVerifyOtpUseCase";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly _otpStore: IOtpStore,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _registerUserUseCase: IRegisterUserUseCase
  ) {}

  async execute(data: VerifyAuthDto) {
    const stored = await this._otpStore.get(data.email);

    if (!stored) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_INVALID_OR_EXPIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (stored.attempt >= 3) {
      await this._otpStore.delete(data.email);
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_MAX_ATTEMPTS_REACHED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const isValidOtp = await this._passwordHasher.comparePassword(
      data.otp,
      stored.otpHash
    );

    if (!isValidOtp) {
      stored.attempt += 1;
      await this._otpStore.update(data.email, stored, 300);
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_INVALID_OR_EXPIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const result = await this._registerUserUseCase.execute({
      fullName: stored.fullName,
      email: stored.email,
      passwordHash: stored.passwordHash,
    });

    await this._otpStore.delete(data.email);
    return result;
  }
}
