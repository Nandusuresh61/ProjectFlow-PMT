import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { Plan } from "@/domain/entities/Plan";
import { PlanModel, PlanDocument } from "../database/models/MongoPlanModel";
import { BaseRepository } from "./BaseRepository";

export class PlanRepository extends BaseRepository<Plan, PlanDocument> implements IPlanRepository {
  constructor() {
    super(PlanModel);
  }

  protected mapToEntity(doc: PlanDocument): Plan {
    return new Plan(
      doc.planId,
      doc.type,
      doc.priceMonthly,
      doc.description,
      doc.maxProjects,
      doc.maxMembers,
      doc.features,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(plan: Plan): Promise<Plan> {
    const planDoc = {
      planId: plan.planId,
      type: plan.type,
      priceMonthly: plan.priceMonthly,
      description: plan.description,
      maxProjects: plan.maxProjects,
      maxMembers: plan.maxMembers,
      features: plan.features,
      isActive: plan.isActive,
    };
    return super.create(planDoc);
  }

  async findById(planId: string): Promise<Plan | null> {
    return this.findOne({ planId });
  }

  async findAll(): Promise<Plan[]> {
    return super.findAll();
  }

  async findActiveByType(type: string): Promise<Plan | null> {
    return this.findOne({ type, isActive: true });
  }

  async update(plan: Plan): Promise<void> {
    await this.updateOne(
      { planId: plan.planId },
      {
        type: plan.type,
        priceMonthly: plan.priceMonthly,
        description: plan.description,
        maxProjects: plan.maxProjects,
        maxMembers: plan.maxMembers,
        features: plan.features,
        isActive: plan.isActive,
        updatedAt: new Date(),
      }
    );
  }
}
