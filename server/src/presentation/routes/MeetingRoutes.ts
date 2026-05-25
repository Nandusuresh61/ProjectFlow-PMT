import { Router } from "express";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";
import { meetingController } from "@/infrastructure/DI/MeetingContainer";
import { workspaceRoleMiddleware } from "@/infrastructure/DI/WorkspaceRoleContatiner";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

const router = Router();

router.post(
  "/",
  authenticatedUser,
  workspaceRoleMiddleware.requireRoles([WorkspaceRoleEnum.WORKSPACE_ADMIN, WorkspaceRoleEnum.WORKSPACE_OWNER]),
  meetingController.createMeeting
);

router.get(
  "/workspace/:workspaceId",
  authenticatedUser,
  meetingController.getWorkspaceMeetings
);

router.get(
  "/:meetingId",
  authenticatedUser,
  meetingController.getMeeting
);

router.post(
  "/:meetingId/end",
  authenticatedUser,
  workspaceRoleMiddleware.requireRoles([WorkspaceRoleEnum.WORKSPACE_ADMIN, WorkspaceRoleEnum.WORKSPACE_OWNER]),
  meetingController.endMeeting
);

export default router;
