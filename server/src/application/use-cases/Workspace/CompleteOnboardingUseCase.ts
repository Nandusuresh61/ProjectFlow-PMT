import {
  CompletedOnboardingDto,
  OnboardingResponseDto,
} from "@/application/dtos/OnboardingDtos";
import { IOnboardingRepository } from "@/application/interfaces/repositories/IOnboardingRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/workspace/ICompleteOnboardingUseCase";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";

export class CompleteOnboardingUseCase implements ICompleteOnboardingUseCase {
  constructor(
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _onboardingRepo: IOnboardingRepository,
    private readonly _uidGenerator: IUidGenerator,
  ) {}

  async execute(dto: CompletedOnboardingDto): Promise<OnboardingResponseDto> {
    const existing = await this._onboardingRepo.findByUserId(dto.userId);

    if (existing) {
      throw new AppError(
        ErrorCode.ONBOARDING,
        AppMessages.ONBOARDING_ALREADY_DONE,
        HttpStatusCode.CONFLICT,
      );
    }
    const workspaceId = this._uidGenerator.createId();

    const workspace = await this._workspaceRepo.createWorkspace({
      workspaceId,
      name: dto.workspaceName,
      ownerId: dto.userId,
      plan: "free",
    });

    await this._workspaceRepo.addMember({
      workspaceMemberId: this._uidGenerator.createId(),
      workspaceId: workspace.workspaceId,
      userId: dto.userId,
      role: "Owner",
      joinedAt: new Date(),
    });

    const invitePromises = dto.teamInvites.map((invite) =>
      this._workspaceRepo.createPendingInvite({
        pendingInviteId: this._uidGenerator.createId(),
        workspaceId: workspace.workspaceId,
        invitedEmail: invite.email,
        role: invite.role,
        invitedBy: dto.userId,
        createdAt: new Date(),
      }),
    );
    await Promise.all(invitePromises);

    await this._onboardingRepo.create({
      userId: dto.userId,
      isCompleted: true,
      workspaceId: workspace.workspaceId,
      completedAt: new Date(),
    });

    return {
      workspaceId: workspace.workspaceId,
      workspaceName: workspace.name,
      plan: workspace.plan,
      invitesSent: dto.teamInvites.length,
    };
  }
}
