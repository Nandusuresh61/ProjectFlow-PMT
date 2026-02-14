import { Plan } from "@/domain/entities/plan/Plan";

export interface IGetAllPlansUsecase {
    execute():Promise<Plan[]>
}