import { IInvitationRepository } from "@/application/interfaces/repositories/IInvitationRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IAcceptInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/IAcceptInvitationUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { InvitationStatus } from "@/shared/enums/InvitationStatusEnum";
import crypto from "crypto";
import { Membership } from "@/domain/entities/Membership";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";

export class AcceptInvitationUseCase implements IAcceptInvitationUseCase {
  constructor(
    private readonly _invitationRepo: IInvitationRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _uidGenerator: IUidGenerator
  ) { }

  async execute(
    token: string,
    userId: string,
  ): Promise<{ workspaceId: string }> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const invitation = await this._invitationRepo.findByTokenHash(tokenHash);

    if (!invitation) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.INVALID_INVITATION,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVITATION_ALREADY_USED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (invitation.expiresAt < new Date()) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVITATION_EXPIRED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (user.email !== invitation.email) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    const membership = new Membership(
      this._uidGenerator.createId(),
      user.userId,
      invitation.workspaceId,
      invitation.role,
      new Date()
    );

    await this._membershipRepo.create(membership);


    await this._invitationRepo.updateStatus(
      invitation.invitationId,
      InvitationStatus.ACCEPTED
    );

    await this._userRepo.updateCurrentWorkspace(user.userId, invitation.workspaceId);

    return { workspaceId: invitation.workspaceId };
  }
}
