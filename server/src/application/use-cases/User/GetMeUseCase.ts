import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IGetMeUseCase } from "@/application/interfaces/use-cases/User/IGetMeUseCase";
import { GetMeResponseDto } from "@/application/dtos/UserDtos";

export class GetMeUseCase implements IGetMeUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(userId: string): Promise<GetMeResponseDto> {
    const user = await this._userRepo.findById(userId);
    const membershipCount = await this._membershipRepo.countByUserId(userId);

    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      currentWorkspaceId: user.currentWorkspaceId,
      membershipCount,
      profileImage: user.profileImage,
    };
  }
}
