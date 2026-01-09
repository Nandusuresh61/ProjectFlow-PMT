import { StartRegisterDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IOtpStore } from "@/application/interfaces/use-cases/cache/IOtpStore";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { AppError, AuthErrorMessages, ErrorCode, HttpStatusCode } from "shared";

export class StartRegisterUseCase implements IStartRegisterUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpStore: IOtpStore
  ) {}
  async execute(data: StartRegisterDto): Promise<void> {
    const existingUser = await this._userRepo.findByEmail(data.email);

    if (existingUser)
      throw new AppError(
        ErrorCode.AUTH,
        AuthErrorMessages.EMAIL_EXISTS,
        HttpStatusCode.CONFLICT
      );

    const otp = Math.floor(10000 + Math.random() * 900000).toString();

    const passwordHash = await this._passwordHasher.createHashPassword(
      data.password
    );

    const otpHash = await this._passwordHasher.createHashPassword(otp);
    const redisKey = `register:${data.email}`;

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
    console.log(`OTP for ${data.email} => `,otp )
  }
}
