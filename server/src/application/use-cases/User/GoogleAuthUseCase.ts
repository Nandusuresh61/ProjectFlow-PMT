import { OAuthUserPayload } from "@/application/dtos/OAuthUserPayload";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { IGoogleAuthUseCase } from "@/application/interfaces/use-cases/User/IGoogleAuthUseCase";
import { AuthProvider } from "@/domain/entities/auth/authProvider";
import {
  AppError,
  AppMessages,
  ErrorCode,
  HttpStatusCode,
  TokenEnums,
} from "shared";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _uidGenerator: IUidGenerator,
  ) {}

  async execute(payload: OAuthUserPayload) {
    if (payload.provider !== AuthProvider.GOOGLE) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.INVALID_AUTH_PROVIDER,
        HttpStatusCode.BAD_REQUEST,
      );
    }
    let user = await this._userRepo.findByEmail(payload.email);

    if (!user) {
      const now = new Date();
      user = {
        userId: this._uidGenerator.createId(),
        fullName: payload.fullName,
        email: payload.email,
        authProvider: AuthProvider.GOOGLE,
        providerId: payload.providerId,
        isOnboarded: false,
        isSuperAdmin: false,
        createdAt: now,
        updatedAt: now,
      };

      await this._userRepo.createUser(user);
    }

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
        isOnboarded: user.isOnboarded,
        currentOrganizationId: user.currentOrganizationId,
      },
      accessToken,
      refreshToken,
    };
  }
}
