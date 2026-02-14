import { Plan } from "@/domain/entities/plan/Plan";

export interface ITogglePlanStatusUseCase {
  execute(planId: string): Promise<Plan>;
}
