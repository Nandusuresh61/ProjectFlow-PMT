import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { workLogController } from "@/infrastructure/DI/WorkLogContainer";

const router = Router();

// These routes follow the requested structure
// Issue-related worklog routes
router.post("/issue/:issueId", authenticatedUser, workLogController.addWorkLog);
router.get("/issue/:issueId", authenticatedUser, workLogController.getIssueWorkLogs);

// Individual worklog routes
router.patch("/:workLogId", authenticatedUser, workLogController.updateWorkLog);
router.delete("/:workLogId", authenticatedUser, workLogController.deleteWorkLog);

export default router;
