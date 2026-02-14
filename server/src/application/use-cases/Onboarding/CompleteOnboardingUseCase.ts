import { CompleteOnboardingDto } from "@/application/dtos/CompleteOnboardingDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IOrganizationRepository } from "@/application/interfaces/repositories/IOrganizationRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/Onboarding/ICompleteOnboardingUseCase";
import { Membership } from "@/domain/entities/membership/Membership";
import { Organization } from "@/domain/entities/org/Organization";
import {
  AppError,
  AppMessages,
  ErrorCode,
  HttpStatusCode,
  OrganizationRoleEnum,
} from "shared";

export class CompleteOnboardingUseCase implements ICompleteOnboardingUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _orgRepo: IOrganizationRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(
    dto: CompleteOnboardingDto,
  ): Promise<{ organizationId: string }> {
    const { userId, workspaceName, planId } = dto;

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (user.isOnboarded) {
      throw new AppError(
        ErrorCode.ONBOARDING,
        AppMessages.USER_ALREADY_ONBOARDED,
        HttpStatusCode.CONFLICT,
      );
    }

    const plan = await this._planRepo.findById(planId);

    if (!plan || !plan.isActive) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const now = new Date();

    const organization = new Organization(
      this._uidGenerator.createId(),
      workspaceName.trim(),
      userId,
      planId,
      now,
      now,
    );

    const createdOrg = await this._orgRepo.create(organization);

    const membership = new Membership(
      this._uidGenerator.createId(),
      userId,
      createdOrg.organizationId!,
      OrganizationRoleEnum.ORG_ADMIN,
      now,
    );

    await this._membershipRepo.create(membership);

    user.isOnboarded = true;
    user.currentOrganizationId = createdOrg.organizationId;

    await this._userRepo.update(user);

    return { organizationId: createdOrg.organizationId };
  }
}
