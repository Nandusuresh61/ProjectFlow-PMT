import { OAuthUserPayload } from "@/application/dtos/OAuthUserPayload";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { IGoogleAuthUseCase } from "@/application/interfaces/use-cases/User/IGoogleAuthUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { AuthProvider } from "@/shared/enums/AuthProviders";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { TokenEnums } from "@/shared/enums/TokenEnums";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { User } from "@/domain/entities/User";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _membershipRepo: IMembershipRepository
  ) { }

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
      user = new User(
        this._uidGenerator.createId(),
        payload.fullName,
        payload.email,
        undefined,
        AuthProvider.GOOGLE,
        payload.providerId,
        undefined,
        false,
        false,
        null,
        now,
        now,
      );

      await this._userRepo.createUser(user);
    }

    if (user.isBlocked) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_BLOCKED,
        HttpStatusCode.FORBIDDEN
      );
    }

    const membershipCount = await this._membershipRepo.countByUserId(user.userId);

    const accessToken = this._tokenService.createAccessToken({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      isBlocked: user.isBlocked,
      type: TokenEnums.ACCESS_TOKEN,
    });
    const refreshToken = this._tokenService.createRefreshToken({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      isBlocked: user.isBlocked,
      type: TokenEnums.REFRESH_TOKEN,
    });

    return {
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        isBlocked: user.isBlocked,
        currentWorkspaceId: user.currentWorkspaceId,
        membershipCount,
      },
      accessToken,
      refreshToken,
    };
  }
}
