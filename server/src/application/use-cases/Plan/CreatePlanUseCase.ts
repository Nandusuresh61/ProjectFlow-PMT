import { CreatePlanDto } from "@/application/dtos/PlanDto";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICreatePlanUseCase } from "@/application/interfaces/use-cases/Plan/ICreatePlanUseCase";
import { Plan } from "@/domain/entities/plan/Plan";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";

export class CreatePlanUseCase implements ICreatePlanUseCase{
  constructor(
    private readonly _planRepo: IPlanRepository,
    private readonly _uidGenerator: IUidGenerator,
  ) {}

  async execute(data: CreatePlanDto): Promise<Plan> {
    const existingPlan = await this._planRepo.findByName(data.name);
    if (existingPlan) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NAME_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT,
      );
    }
    const now = new Date();
    const plan = new Plan(
      this._uidGenerator.createId(),
      data.name,
      data.priceMonthly,
      data.description,
      data.maxProjects,
      data.maxMembers,
      data.features,
      true,
      now,
      now,
    );

    return await this._planRepo.create(plan);
  }
}
