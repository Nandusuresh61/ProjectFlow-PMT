import { CreatePlanDto } from "@/application/dtos/PlanDto";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICreatePlanUseCase } from "@/application/interfaces/use-cases/Plan/ICreatePlanUseCase";
import { Plan } from "@/domain/entities/Plan";


import { PlanType } from "@/shared/enums/PlanType";

export class CreatePlanUseCase implements ICreatePlanUseCase{
  constructor(
    private readonly _planRepo: IPlanRepository,
    private readonly _uidGenerator: IUidGenerator,
  ) {}

  async execute(data: CreatePlanDto): Promise<Plan> {
    // 1. Deactivate existing active plan of the same type
    const activePlan = await this._planRepo.findActiveByType(data.type);
    if (activePlan) {
      activePlan.isActive = false;
      await this._planRepo.update(activePlan);
    }

    // 2. Determine price
    const priceMonthly = data.type === PlanType.FREE ? 0 : data.priceMonthly;

    // 3. Determine limits
    const maxProjects = data.type === PlanType.ENTERPRISE ? -1 : (data.maxProjects ?? 0);
    const maxMembers = data.type === PlanType.ENTERPRISE ? -1 : (data.maxMembers ?? 0);

    const now = new Date();
    const plan = new Plan(
      this._uidGenerator.createId(),
      data.type,
      priceMonthly,
      data.description,
      maxProjects,
      maxMembers,
      data.features,
      true,
      now,
      now,
    );

    return await this._planRepo.create(plan);
  }
}
