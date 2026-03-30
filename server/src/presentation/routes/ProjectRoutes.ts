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

export default router;
