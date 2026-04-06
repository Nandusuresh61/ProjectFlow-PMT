import { IGetInvitationDetailsUseCase, InvitationDetailsDto } from "@/application/interfaces/use-cases/Invitation/IGetInvitationDetailsUseCase";
import { IInvitationRepository } from "@/application/interfaces/repositories/IInvitationRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { InvitationStatus } from "@/shared/enums/InvitationStatusEnum";
import crypto from "crypto";

export class GetInvitationDetailsUseCase implements IGetInvitationDetailsUseCase {
  constructor(
    private readonly _invitationRepo: IInvitationRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(token: string): Promise<InvitationDetailsDto> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const invitation = await this._invitationRepo.findByTokenHash(tokenHash);

    if (!invitation) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.INVALID_INVITATION,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVITATION_ALREADY_USED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVITATION_EXPIRED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const existingUser = await this._userRepo.findByEmail(invitation.email);

    return {
      email: invitation.email,
      isRegistered: !!existingUser,
      workspaceId: invitation.workspaceId,
      role: invitation.role,
    };
  }
}
