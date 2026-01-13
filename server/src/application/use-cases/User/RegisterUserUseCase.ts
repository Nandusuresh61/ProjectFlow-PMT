import {
  RegisterVerifiedUserDto,
  UserAuthResponseDto,
} from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { IRegisterUserUseCase } from "@/application/interfaces/use-cases/User/IRegisterUserUseCase";
import {
  AppError,
  AuthErrorMessages,
  ErrorCode,
  HttpStatusCode,
  TokenEnums,
} from "shared";

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _tokenService: ITokenService
  ) {}

  
  async execute(user: RegisterVerifiedUserDto): Promise<UserAuthResponseDto> {

    const now = new Date();
    const newUser = await this._userRepo.createUser({
      userId: this._uidGenerator.createId(),
      fullName: user.fullName,
      email: user.email,
      passwordHash: user.passwordHash,
      isSuperAdmin: false,
      createdAt: now,
      updatedAt: now,
    });

    const accessToken = this._tokenService.createAccessToken({
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
      isSuperAdmin: newUser.isSuperAdmin,
      type: TokenEnums.ACCESS_TOKEN,
    });
    const refreshToken = this._tokenService.createRefreshToken({
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
      isSuperAdmin: newUser.isSuperAdmin,
      type: TokenEnums.REFRESH_TOKEN,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
