import { projectController } from "@/infrastructure/DI/ProjectContainer";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";
import { Router } from "express";

const router = Router();

router.post("/", authenticatedUser, projectController.createProject);
router.patch("/:projectId", authenticatedUser, projectController.updateProject);
router.get(
  "/workspace/:workspaceId",
  authenticatedUser,
  projectController.getWorkspaceProjects
);
router.get("/:projectId/members", authenticatedUser, projectController.getProjectMembers);
router.get("/:projectId/overview", authenticatedUser, projectController.getProjectOverview);

export default router;
