import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { Plan } from "@/domain/entities/plan/Plan";
import { PlanModel } from "../database/models/MongoPlanModel";

export class MongoPlanRepository implements IPlanRepository {
  async create(plan: Plan): Promise<Plan> {
    const created = await PlanModel.create({
      planId: plan.planId,
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      description: plan.description,
      maxProjects: plan.maxProjects,
      maxMembers: plan.maxMembers,
      features: plan.features,
      isActive: plan.isActive,
    });

    return this.mapToDomain(created);
  }

  async findById(planId: string): Promise<Plan | null> {
    const found = await PlanModel.findOne({ planId });
    if (!found) return null;
    return this.mapToDomain(found);
  }

  async findAll(): Promise<Plan[]> {
    const plans = await PlanModel.find();
    return plans.map((doc) => this.mapToDomain(doc));
  }

  async findByName(name: string): Promise<Plan | null> {
    const found = await PlanModel.findOne({ name });
    if (!found) return null;
    return this.mapToDomain(found);
  }

  async update(plan: Plan): Promise<void> {
    await PlanModel.findOneAndUpdate(
      { planId: plan.planId },
      {
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        description: plan.description,
        maxProjects: plan.maxProjects,
        maxMembers: plan.maxMembers,
        features: plan.features,
        isActive: plan.isActive,
        updatedAt: new Date(),
      },
    );
  }

  private mapToDomain(doc: any): Plan {
    return new Plan(
      doc.planId,
      doc.name,
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
}
