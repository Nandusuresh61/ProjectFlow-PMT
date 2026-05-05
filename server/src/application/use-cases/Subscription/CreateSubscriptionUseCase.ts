import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { Subscription } from "@/domain/entities/Subscription";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

export interface CreateSubscriptionDto {
  workspaceId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status?: SubscriptionStatus;
}

export class CreateSubscriptionUseCase {
  constructor(
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = new Subscription(
      this._uidGenerator.createId(),
      dto.workspaceId,
      dto.planId,
      dto.status || SubscriptionStatus.ACTIVE,
      dto.startDate,
      dto.endDate,
      "monthly"
    );

    return this._subscriptionRepo.create(subscription);
  }
}
