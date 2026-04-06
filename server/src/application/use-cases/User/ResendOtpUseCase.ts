import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { EmailType } from "@/shared/enums/EmailEnums";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { logger } from "@/infrastructure/utils/Logger";
import { EmailTemplates } from "@/infrastructure/utils/EmailTemplates";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _otpStore: IOtpStore,
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _emailService: IEmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const RESEND_COOLDOWN_MS = 60 * 1000;
    const pending = await this._otpStore.get(email);

    if (!pending) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.OTP_INVALID_OR_EXPIRED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const now = Date.now();
    logger.info(
      `[ResendOtp] Checking cooldown for ${email}. LastSent: ${pending.lastOtpSentAt ? new Date(pending.lastOtpSentAt).toISOString() : "N/A"}, Now: ${new Date(now).toISOString()}`,
    );

    if (
      pending.lastOtpSentAt &&
      now - pending.lastOtpSentAt < RESEND_COOLDOWN_MS
    ) {
      const remaining = RESEND_COOLDOWN_MS - (now - pending.lastOtpSentAt);
      logger.info(`[ResendOtp] Cooldown active. Remaining: ${remaining}ms`);
      throw new AppError(
        ErrorCode.OTP_RESEND_COOLDOWN,
        AppMessages.OTP_RESEND_COOLDOWN,
        HttpStatusCode.TOO_MANY_REQUESTS,
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
        lastOtpSentAt: now,
      },
      300,
    );

    // Otp to mail
    logger.info(`>>>  OTP <<< [ResendOtp] New OTP for ${email}: ${otp}`);

    const { subject, body } = EmailTemplates.getOtpTemplate(otp);

    await this._emailService.sendMail({
      to: email,
      subject,
      body,
      type: EmailType.OTP,
    });
  }
}
