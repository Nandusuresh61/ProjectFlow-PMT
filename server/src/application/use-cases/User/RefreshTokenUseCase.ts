import { IRefreshTokenUseCase } from "../../interfaces/use-cases/User/IRefreshTokenUseCase";
import { ITokenService } from "../../interfaces/services/ITokenService";
import { AppError } from "@/shared/errors/AppError";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { AppMessages } from "@/shared/messages/AppMessages";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.TOKEN_REFRESH_INVALID,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const newAccessToken = this.tokenService.createAccessToken({
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      isSuperAdmin: payload.isSuperAdmin,
      isBlocked: payload.isBlocked,
      type: payload.type,
    });

    const newRefreshToken = this.tokenService.createRefreshToken({
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      isSuperAdmin: payload.isSuperAdmin,
      isBlocked: payload.isBlocked,
      type: payload.type,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
