import {
  RegisterVerifiedUserDto,
  UserAuthResponseDto,
} from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { IRegisterUserUseCase } from "@/application/interfaces/use-cases/User/IRegisterUserUseCase";

import { AuthProvider } from "@/shared/enums/AuthProviders";
import { TokenEnums } from "@/shared/enums/TokenEnums";
import { User } from "@/domain/entities/User";

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _tokenService: ITokenService,
  ) { }

  async execute(user: RegisterVerifiedUserDto): Promise<UserAuthResponseDto> {
    const now = new Date();
    const newUser = await this._userRepo.createUser(
      new User(
        this._uidGenerator.createId(),
        user.fullName,
        user.email,
        user.passwordHash,
        AuthProvider.LOCAL,
        undefined,
        undefined,
        false,
        false,
        null,
        now,
        now,
      )
    );

    const accessToken = this._tokenService.createAccessToken({
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
      isSuperAdmin: newUser.isSuperAdmin,
      isBlocked: newUser.isBlocked,
      type: TokenEnums.ACCESS_TOKEN,
    });
    const refreshToken = this._tokenService.createRefreshToken({
      userId: newUser.userId,
      fullName: newUser.fullName,
      email: newUser.email,
      isSuperAdmin: newUser.isSuperAdmin,
      isBlocked: newUser.isBlocked,
      type: TokenEnums.REFRESH_TOKEN,
    });
    return {
      user: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        isSuperAdmin: newUser.isSuperAdmin,
        isBlocked: newUser.isBlocked,
        currentWorkspaceId: newUser.currentWorkspaceId,
        membershipCount: 0,
      },
      accessToken,
      refreshToken,
    };
  }
}
