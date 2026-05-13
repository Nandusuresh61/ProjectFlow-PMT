import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { ITogglePlanStatusUseCase } from "@/application/interfaces/use-cases/Plan/ITogglePlanStatusUseCase";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class TogglePlanStatusUseCase implements ITogglePlanStatusUseCase {
  constructor(private readonly _planRepo: IPlanRepository) {}

  async execute(planId: string) {
    const plan = await this._planRepo.findById(planId);

    if (!plan) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    plan.isActive = !plan.isActive;
    await this._planRepo.update(plan);
    return plan;
  }
}
