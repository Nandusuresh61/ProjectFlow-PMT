import { Router } from "express";
import { planController } from "@/infrastructure/DI/PlanContainer";

const router = Router();

router.post('/',planController.createPlan);
export default router;