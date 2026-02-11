import { CreatePlanUseCase } from "@/application/use-cases/Plan/CreatePlanUseCase";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { UidService } from "../services/UidService";
import { PlanController } from "@/presentation/controllers/PlanController";

const planRepostitory = new MongoPlanRepository();
const uidGenerator = new UidService();

const createPlanUseCase = new CreatePlanUseCase(planRepostitory, uidGenerator);

export const planController = new PlanController(createPlanUseCase);
