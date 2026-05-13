import { Router } from "express";
import { sprintAnalyticsController } from "@/infrastructure/DI/SprintAnalyticsContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.get(
  "/projects/:projectId/analytics/velocity",
  authenticatedUser,
  sprintAnalyticsController.getProjectVelocity,
);

router.get(
  "/projects/:projectId/analytics/sprints",
  authenticatedUser,
  sprintAnalyticsController.getSprintPerformanceSummary,
);

router.get(
  "/sprints/:sprintId/analytics",
  authenticatedUser,
  sprintAnalyticsController.getSprintAnalytics,
);

export default router;
