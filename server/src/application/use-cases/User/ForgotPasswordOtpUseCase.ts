import { ForgotRequestDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IResetPasswordOtpStore } from "@/application/interfaces/use-cases/cache/IResetPasswordOtpStore";
import { IForgotPasswordOtpUseCase } from "@/application/interfaces/use-cases/User/IForgotPasswordOtpUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { EmailType } from "@/shared/enums/EmailEnums";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { EmailTemplates } from "@/infrastructure/utils/EmailTemplates";

export class ForgotPasswordOtpUseCase implements IForgotPasswordOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _resetPasswordOtpStore: IResetPasswordOtpStore,
    private readonly _emailService: IEmailService,
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _passwordHash: IPasswordHasher,
  ) { }
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

    console.log(`OTP for forgot password: ${otp}`);

    const otpHash = await this._passwordHash.createHashPassword(otp);

    await this._resetPasswordOtpStore.save(
      email,
      { otpHash, attempt: 0, lastOtpAttemptAt: Date.now() },
      300,
    );
    const { subject, body } = EmailTemplates.getResetPasswordTemplate(otp);

    await this._emailService.sendMail({
      to: email,
      subject,
      body,
      type: EmailType.RESET_PASSWORD,
    });
  }
}
