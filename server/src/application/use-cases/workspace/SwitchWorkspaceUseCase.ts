import { ISwitchWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ISwitchWorkspaceUseCase";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";

export class SwitchWorkspaceUseCase implements ISwitchWorkspaceUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(userId: string, workspaceId: string): Promise<{ success: boolean; message: string }> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
        throw new AppError(
            ErrorCode.AUTH,
            AppMessages.USER_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(userId, workspaceId);
    if (!membership) {
        throw new AppError(
            ErrorCode.AUTH,
            "User is not a member of this workspace",
            HttpStatusCode.FORBIDDEN
        );
    }

    user.currentWorkspaceId = workspaceId;
    await this._userRepo.update(user);

    return {
        success: true,
        message: "Switched workspace successfully"
    };
  }
}
