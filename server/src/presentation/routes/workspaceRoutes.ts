import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { invitationController } from "@/infrastructure/DI/InvitationContatiner";
import { workspaceController } from "@/infrastructure/DI/WorkspaceContatiner";
import { workspaceRoleMiddleware } from "@/infrastructure/DI/WorkspaceRoleContatiner";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

const router = Router();


router.get(
  "/check-name",
  authenticatedUser,
  workspaceController.checkNameAvailability
);

router.post(
  "/invite/accept",
  authenticatedUser,
  invitationController.acceptInvitation
);

router.get(
  "/invite/details/:token",
  invitationController.getInvitationDetails
);

// User Workspaces
router.get(
  "/user/workspaces",
  authenticatedUser,
  workspaceController.getUserWorkspaces
);

// Switch Workspace
router.put(
  "/:workspaceId/switch",
  authenticatedUser,
  workspaceController.switchWorkspace
);

// Create Workspace
router.post(
  "/create",
  authenticatedUser,
  workspaceController.createWorkspace
);

// Invitation Api
router.post(
  "/:workspaceId/invite",
  authenticatedUser,
  workspaceRoleMiddleware.requireRoles([WorkspaceRoleEnum.WORKSPACE_ADMIN]),
  invitationController.inviteUser
);

// List workspacemember adminside 
router.get(
  "/:workspaceId/members",
  authenticatedUser,
  workspaceController.getMembers
);

// Dashboard Data
router.get(
  "/:workspaceId/dashboard",
  authenticatedUser,
  workspaceController.getDashboardData
);

export default router;
