import { ForgotRequestDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IResetPasswordOtpStore } from "@/application/interfaces/use-cases/cache/IResetPasswordOtpStore";
import { IForgotPasswordOtpUseCase } from "@/application/interfaces/use-cases/User/IForgotPasswordOtpUseCase";
import {
  AppError,
  AppMessages,
  EmailType,
  ErrorCode,
  HttpStatusCode,
} from "shared";

export class ForgotPasswordOtpUseCase implements IForgotPasswordOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _resetPasswordOtpStore: IResetPasswordOtpStore,
    private readonly _emailService: IEmailService,
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _passwordHash: IPasswordHasher,
  ) {}
  async execute(dto: ForgotRequestDto): Promise<void> {
    const { email } = dto;
    const user = await this._userRepo.findByEmail(email);

    if (!user)
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.INVALID_EMAIL,
        HttpStatusCode.BAD_REQUEST,
      );

    const otp = this._otpGenerator.generateOtp();
    console.log("ForgotPasswordOtp : ", otp);

    const otpHash = await this._passwordHash.createHashPassword(otp);

    await this._resetPasswordOtpStore.save(
      email,
      { otpHash, attempt: 0, lastOtpAttemptAt: Date.now() },
      300,
    );
    await this._emailService.sendMail({
      to: email,
      subject: "Reset your password - OTP",
      body: `
        <p>You requested to reset your password.</p>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
      type: EmailType.RESET_PASSWORD,
    });
  }
}
