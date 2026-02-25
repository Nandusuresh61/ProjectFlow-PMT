import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { invitationController } from "@/infrastructure/DI/InvitationContatiner";
import { workspaceController } from "@/infrastructure/DI/WorkspaceContatiner";
import { workspaceRoleMiddleware } from "@/infrastructure/DI/WorkspaceRoleContatiner";
import { WorkspaceRoleEnum } from "shared";

const router = Router();


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
export default router;
