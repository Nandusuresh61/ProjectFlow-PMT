import { Plan } from "@/domain/entities/Plan";

export interface ITogglePlanStatusUseCase {
  execute(planId: string): Promise<Plan>;
}
