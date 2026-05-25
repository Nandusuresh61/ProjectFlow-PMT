import { config } from "@/app.config";
import { CreateInvitationDto } from "@/application/dtos/InvitationDto";
import { IInvitationRepository } from "@/application/interfaces/repositories/IInvitationRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IEmailService } from "@/application/interfaces/services/IEmailService";
import { IPasswordHasher } from "@/application/interfaces/services/IPasswordHasher";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { IWorkspaceEventTrackingService } from "@/application/interfaces/services/IWorkspaceEventTrackingService";
import { ICreateInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/ICreateInvitationUseCase";
import { Invitation } from "@/domain/entities/Invitation";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { EmailType } from "@/shared/enums/EmailEnums";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { InvitationStatus } from "@/shared/enums/InvitationStatusEnum";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { EmailTemplates } from "@/infrastructure/utils/EmailTemplates";

import crypto from "crypto";

export class CreateInvitationUseCase implements ICreateInvitationUseCase {
  constructor(
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _invitationRepo: IInvitationRepository,
    private readonly _emailService: IEmailService,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _eventTracker: IWorkspaceEventTrackingService
  ) { }

  async execute(dto: CreateInvitationDto): Promise<void> {
    const { workspaceId, inviterId, email, role } = dto;

    /**
     * Validate workspace exists
     */
    const workspace = await this._workspaceRepo.findById(workspaceId);

    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    /**
     * Validate inviter is admin of workspace
     */
    const membership = await this._membershipRepo.findByUserAndWorkspace(
      inviterId,
      workspaceId,
    );

    if (
      membership.role !== WorkspaceRoleEnum.WORKSPACE_OWNER &&
      membership.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN &&
      workspace.ownerId !== inviterId
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    /**
     *  Validate plan exists
     */
    const plan = await this._planRepo.findById(workspace.planId);

    if (!plan) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /**
     * Validate member limit
     */
    const currentMemberCount =
      await this._membershipRepo.countByWorkspace(workspaceId);

    const pendingInvitationCount =
      await this._invitationRepo.countPendingByWorkspace(workspaceId);

    if (plan.maxMembers !== -1 && (currentMemberCount + pendingInvitationCount >= plan.maxMembers)) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.MEMBER_LIMIT_EXCEEDED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    /**
     * Check if user already exists and is member
     */
    const existingUser = await this._userRepo.findByEmail(email);

    if (existingUser) {
      const existingMembership =
        await this._membershipRepo.findByUserAndWorkspace(
          existingUser.userId,
          workspaceId,
        );

      if (existingMembership) {
        throw new AppError(
          ErrorCode.CONFLICT,
          AppMessages.USER_ALREADY_MEMBER,
          HttpStatusCode.CONFLICT,
        );
      }
    }

    /**
     *  Check existing pending invite
     */
    const existingInvite =
      await this._invitationRepo.findPendingByEmailAndWorkspace(
        email,
        workspaceId,
      );

    if (existingInvite) {
      throw new AppError(
        ErrorCode.CONFLICT,
        AppMessages.INVITATION_ALREADY_SENT,
        HttpStatusCode.CONFLICT,
      );
    }

    /**
     * Generate secure token
     */
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    /**
     *  Create invitation entity
     */
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + 24 * 60 * 60 * 1000, // 24 hours
    );

    const invitation = new Invitation(
      this._uidGenerator.createId(),
      email,
      workspaceId,
      role,
      tokenHash,
      InvitationStatus.PENDING,
      expiresAt,
      now,
    );

    /**
     * Save invitation
     */
    await this._invitationRepo.create(invitation);

    /**
     * Send email
     */
    const inviteLink = `${config.FRONTEND_BASE_URL}/invite/accept?token=${rawToken}`;

    const { subject, body } = EmailTemplates.getInviteTemplate(inviteLink);

    await this._emailService.sendMail({
      to: email,
      subject,
      body,
      type: EmailType.INVITE_USER,
    });

    await this._eventTracker.trackEvent({
      workspaceId: workspaceId,
      actorId: inviterId,
      eventType: "MEMBER_INVITED",
      entityType: "USER",
      entityId: invitation.invitationId, // We use invitationId since user might not exist yet
      metadata: {
        email: email,
        role: role,
      }
    });
  }
}
