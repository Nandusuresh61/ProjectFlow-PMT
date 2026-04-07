import Router from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { sprintController } from "../../infrastructure/DI/SprintContainer";

const router = Router();

router.post("/", authenticatedUser, sprintController.createSprint);
router.get("/project/:projectId", authenticatedUser, sprintController.getSprintsByProject);

export default router;