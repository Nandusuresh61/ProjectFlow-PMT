import { Plan } from "@/domain/entities/Plan";

export interface IGetAllPlansUsecase {
    execute():Promise<Plan[]>
}