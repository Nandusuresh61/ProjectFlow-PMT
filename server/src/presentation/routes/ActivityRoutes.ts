import { Router } from "express";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";
import { workspaceActivityController } from "@/infrastructure/DI/ActivityContainer";

const router = Router();

router.get("/workspace/:workspaceId", authenticatedUser, workspaceActivityController.getWorkspaceFeed.bind(workspaceActivityController));
router.get("/entity/:entityId", authenticatedUser, workspaceActivityController.getEntityTimeline.bind(workspaceActivityController));

export default router;
