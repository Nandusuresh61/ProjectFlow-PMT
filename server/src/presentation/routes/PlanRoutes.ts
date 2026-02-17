import { Router } from "express";
import { planController } from "@/infrastructure/DI/PlanContainer";
import { superAdminOnly } from "../middlewares/AdminMiddleware";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/",authenticatedUser, superAdminOnly, planController.createPlan);

router.get("/", planController.getPlans);

router.patch("/:planId/toggle",authenticatedUser,superAdminOnly, planController.togglePlanStatus);

export default router;
