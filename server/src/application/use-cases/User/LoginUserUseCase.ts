import {
  LoginRequestDto,
  UserAuthResponseDto,
} from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import {
  AppError,
  AppMessages,
  ErrorCode,
  HttpStatusCode,
  TokenEnums,
} from "shared";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";

export class LoginUserUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHash: IPasswordHasher,
    private readonly _membershipRepo: IMembershipRepository
  ) { }

  async execute(data: LoginRequestDto): Promise<UserAuthResponseDto> {
    const user = await this._userRepo.findByEmail(data.email);

    if (!user)
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.INVALID_EMAIL,
        HttpStatusCode.BAD_REQUEST,
      );

    const isMatch = await this._passwordHash.comparePassword(
      data.password,
      user.passwordHash,
    );
    if (!isMatch)
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.INVALID_CREDENTIALS,
        HttpStatusCode.CONFLICT,
      );

    const membershipCount = await this._membershipRepo.countByUserId(user.userId);

    const accessToken = this._tokenService.createAccessToken({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      type: TokenEnums.ACCESS_TOKEN,
    });
    const refreshToken = this._tokenService.createRefreshToken({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      type: TokenEnums.REFRESH_TOKEN,
    });
    return {
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        currentWorkspaceId: user.currentWorkspaceId,
        membershipCount,
      },
      accessToken,
      refreshToken,
    };
  }
}
