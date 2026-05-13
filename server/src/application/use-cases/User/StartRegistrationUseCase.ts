import { StartRegisterDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { EmailType } from "@/shared/enums/EmailEnums";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { logger } from "@/infrastructure/utils/Logger";
import { EmailTemplates } from "@/infrastructure/utils/EmailTemplates";

export class StartRegistrationUseCase implements IStartRegisterUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpStore: IOtpStore,  
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _emailService: IEmailService
  ) { }
  async execute(data: StartRegisterDto): Promise<void> {
    const existingUser = await this._userRepo.findByEmail(data.email);

    if (existingUser)
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.EMAIL_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT
      );

    const otp = this._otpGenerator.generateOtp();

    const passwordHash = await this._passwordHasher.createHashPassword(
      data.password
    );

    const otpHash = await this._passwordHasher.createHashPassword(otp);

    const now = Date.now();
    logger.info(` [StartRegistration] OTP for ${data.email}: ${otp} | Time: ${new Date(now).toISOString()}`);

    await this._otpStore.save(
      data.email,
      {
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        otpHash,
        attempt: 0,
        lastOtpSentAt: now
      },
      300
    );

    const { subject, body } = EmailTemplates.getOtpTemplate(otp, data.fullName);

    await this._emailService.sendMail({
      to: data.email,
      subject,
      body,
      type: EmailType.OTP,
    });
  }
}
