import { CreatePlanUseCase } from "@/application/use-cases/Plan/CreatePlanUseCase";
import { PlanRepository } from "../repositories/PlanRepository";
import { UidService } from "../services/UidService";
import { PlanController } from "@/presentation/controllers/PlanController";
import { GetAllPlansUseCase } from "@/application/use-cases/Plan/GetAllPlansUseCase";
import { TogglePlanStatusUseCase } from "@/application/use-cases/Plan/TogglePlanStatusUseCase";

const planRepostitory = new PlanRepository();
const uidGenerator = new UidService();

const createPlanUseCase = new CreatePlanUseCase(planRepostitory, uidGenerator);
const getAllPlansUseCase = new GetAllPlansUseCase(planRepostitory);
const togglePlanStatusUseCase = new TogglePlanStatusUseCase(planRepostitory);

export const planController = new PlanController(
  createPlanUseCase,
  getAllPlansUseCase,
  togglePlanStatusUseCase,
);
