import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IGetAllPlansUsecase } from "@/application/interfaces/use-cases/Plan/IGetAllPlansUseCase";
import { Plan } from "@/domain/entities/plan/Plan";

export class GetAllPlansUseCase implements IGetAllPlansUsecase{
  constructor(private readonly _planRepo: IPlanRepository) {}

  async execute(): Promise<Plan[]> {
    return await this._planRepo.findAll();
  }
}
