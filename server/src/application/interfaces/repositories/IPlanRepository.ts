import { Plan } from "@/domain/entities/Plan";

export interface IPlanRepository {
    create(plan: Plan): Promise<Plan>;
    findById(planId: string):Promise<Plan>;
    findAll():Promise<Plan[]>;
    findByName(name: string): Promise<Plan | null>;
    update(plan: Plan): Promise<void>;
}