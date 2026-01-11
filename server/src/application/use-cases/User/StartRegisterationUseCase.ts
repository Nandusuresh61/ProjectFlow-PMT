import { StartRegisterDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IOtpGenerator } from "@/application/interfaces/services/IOtpGenerator";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { AppError, AuthErrorMessages, EmailMessages, EmailType, ErrorCode, HttpStatusCode } from "shared";

export class StartRegisterUseCase implements IStartRegisterUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpStore: IOtpStore,
    private readonly _otpGenerator: IOtpGenerator,
    private readonly _emailService: IEmailService
  ) {}
  async execute(data: StartRegisterDto): Promise<void> {
    const existingUser = await this._userRepo.findByEmail(data.email);

    if (existingUser)
      throw new AppError(
        ErrorCode.AUTH,
        AuthErrorMessages.EMAIL_EXISTS,
        HttpStatusCode.CONFLICT
      );

    const otp = this._otpGenerator.generateOtp();

    const passwordHash = await this._passwordHasher.createHashPassword(
      data.password
    );

    const otpHash = await this._passwordHasher.createHashPassword(otp);

    await this._otpStore.save(
      data.email,
      {
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        otpHash,
        attempt: 0,
      },
      300
    );
    console.log(`OTP for ${data.email} => `, otp);
    await this._emailService.sendMail({
      to: data.email,
      subject: EmailMessages.OTP_EMAIL_SUBJECT,
      body: `
    <h3>OTP Verification</h3>
    <p>Hello ${data.fullName},</p>
    <p>Your OTP is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
  `,
      type: EmailType.OTP,
    });
  }
}
