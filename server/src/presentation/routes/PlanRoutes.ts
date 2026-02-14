import { Router } from "express";
import { planController } from "@/infrastructure/DI/PlanContainer";

const router = Router();

router.post("/", planController.createPlan);

router.get("/", planController.getPlans);

router.patch("/:planId/toggle", planController.togglePlanStatus);

export default router;
