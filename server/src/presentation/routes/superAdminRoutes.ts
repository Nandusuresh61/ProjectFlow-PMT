import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { superAdminOnly } from "../middlewares/AdminMiddleware";
import { superAdminUserController } from "@/infrastructure/DI/SuperAdminUserContainer";
import { superAdminWorkspaceController } from "@/infrastructure/DI/SuperAdminWorkspaceContainer";

const router = Router();

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