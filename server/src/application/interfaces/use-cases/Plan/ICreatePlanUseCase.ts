import { CreatePlanDto } from "@/application/dtos/PlanDto";
import { Plan } from "@/domain/entities/plan/Plan";

export interface ICreatePlanUseCase {
    execute(data: CreatePlanDto): Promise<Plan> ;
}