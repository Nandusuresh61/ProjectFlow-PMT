import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { superAdminOnly } from "../middlewares/AdminMiddleware";
import { superAdminUserController } from "@/infrastructure/DI/SuperAdminUserContainer";
import { superAdminWorkspaceController } from "@/infrastructure/DI/SuperAdminWorkspaceContainer";
import { superAdminDashboardController } from "@/infrastructure/DI/SuperAdminDashboardContainer";

const router = Router();

// Dashboard APIs
router.get(
  "/dashboard/stats",
  authenticatedUser,
  superAdminOnly,
  superAdminDashboardController.getStats
);

router.get(
  "/dashboard/revenue",
  authenticatedUser,
  superAdminOnly,
  superAdminDashboardController.getRevenueOverview
);

router.get(
  "/dashboard/workspace-growth",
  authenticatedUser,
  superAdminOnly,
  superAdminDashboardController.getWorkspaceGrowth
);

router.get(
  "/dashboard/recent-workspaces",
  authenticatedUser,
  superAdminOnly,
  superAdminDashboardController.getRecentWorkspaces
);

router.get(
  "/dashboard/pending-tickets",
  authenticatedUser,
  superAdminOnly,
  superAdminDashboardController.getPendingTickets
);

router.get(
  "/getusers",
  authenticatedUser,
  superAdminOnly,
  superAdminUserController.getAllUsersWithWorkspaces
);

router.get(
  "/user/:userId",
  authenticatedUser,
  superAdminOnly,
  superAdminUserController.getUserDetails
);

router.patch(
  "/toggle-block/:userId",
  authenticatedUser,
  superAdminOnly,
  superAdminUserController.toggleUserBlock
);

router.get(
  "/workspaces",
  authenticatedUser,
  superAdminOnly,
  superAdminWorkspaceController.getAllWorkspaces
);

router.get(
  "/workspace/:workspaceId",
  authenticatedUser,
  superAdminOnly,
  superAdminWorkspaceController.getWorkspaceDetails
);

router.patch(
  "/workspace/:workspaceId/toggle-suspend",
  authenticatedUser,
  superAdminOnly,
  superAdminWorkspaceController.toggleWorkspaceSuspension
);

export default router;