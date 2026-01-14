import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";
import {
  AppError,
  AuthErrorMessages,
  EmailMessages,
  EmailType,
  ErrorCode,
  HttpStatusCode,
} from "shared";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpStore: IOtpStore,
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _emailService: IEmailService
  ) {}

  async execute(email: string): Promise<void> {
    const RESEND_COOLDOWN_MS = 60 * 1000; // 60 Seconds coolDown
    const pending = await this._otpStore.get(email);

    if (!pending) {
      throw new AppError(
        ErrorCode.AUTH,
        AuthErrorMessages.OTP_ERROR,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const now = Date.now();

    if (
      pending.lastOtpSentAt &&
      now - pending.lastOtpSentAt < RESEND_COOLDOWN_MS
    ) {
      throw new AppError(
        ErrorCode.OTP_RESEND_COOLDOWN,
        AuthErrorMessages.OTP_RESEND_COOLDOWN,
        HttpStatusCode.TOO_MANY_REQUESTS
      );
    } 

    // remove old otp

    await this._otpStore.delete(email);

    // new otp generation
    const otp = this._otpGenerator.generateOtp();

    //hash otpp
    const otpHash = await this._passwordHasher.createHashPassword(otp);

    // store otp

    await this._otpStore.save(
      email,
      {
        ...pending,
        otpHash,
        attempt: 0,
      },
      300
    );

    // Otp to mail

    await this._emailService.sendMail({
      to: email,
      subject: EmailMessages.OTP_EMAIL_SUBJECT,
      body: `
        <h3>OTP Verification</h3>
        <p>Your new OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
      type: EmailType.OTP,
    });
  }
}
