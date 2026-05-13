import { Plan } from "@/domain/entities/Plan";

export class PlanMapper {
    static toDTO(plan: Plan) {
        return {
            planId: plan.planId,
            type: plan.type,
            priceMonthly: plan.priceMonthly,
            description: plan.description,
            maxProjects: plan.maxProjects,
            maxMembers: plan.maxMembers,
            features: plan.features,
            isActive: plan.isActive,
            popular: false, 
        };
    }
}
