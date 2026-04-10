import Router from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { sprintController } from "../../infrastructure/DI/SprintContainer";
import { workspaceRoleMiddleware } from "../../infrastructure/DI/WorkspaceRoleContatiner";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

const router = Router();

router.post(
  "/",
  authenticatedUser,
  workspaceRoleMiddleware.requireRoles([WorkspaceRoleEnum.WORKSPACE_ADMIN, WorkspaceRoleEnum.WORKSPACE_OWNER]),
  sprintController.createSprint
);

router.get("/project/:projectId", authenticatedUser, sprintController.getSprintsByProject);
router.get("/project/:projectId/active", authenticatedUser, sprintController.getActiveSprint);

router.patch("/assign-issue", authenticatedUser, sprintController.assignIssueToSprint);

router.patch(
  "/start",
  authenticatedUser,
  workspaceRoleMiddleware.requireRoles([WorkspaceRoleEnum.WORKSPACE_ADMIN, WorkspaceRoleEnum.WORKSPACE_OWNER]),
  sprintController.startSprint
);

export default router;