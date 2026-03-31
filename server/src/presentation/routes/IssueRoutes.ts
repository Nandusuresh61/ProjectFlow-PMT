import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { issueController } from "@/infrastructure/DI/IssueContainer";

const router = Router();


router.post("/", authenticatedUser, issueController.createIssue);
router.get("/project/:projectId", authenticatedUser, issueController.getIssuesByProject);
router.patch("/:issueId", authenticatedUser, issueController.updateIssue);


export default router;
