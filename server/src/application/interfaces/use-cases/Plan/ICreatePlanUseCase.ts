import { CreatePlanDto } from "@/application/dtos/PlanDto";
import { Plan } from "@/domain/entities/Plan";

export interface ICreatePlanUseCase {
    execute(data: CreatePlanDto): Promise<Plan> ;
}