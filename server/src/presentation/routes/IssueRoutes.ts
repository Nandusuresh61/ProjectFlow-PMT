import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { issueController } from "@/infrastructure/DI/IssueContainer";

const router = Router();


router.post("/", authenticatedUser, issueController.createIssue);
router.get("/project/:projectId", authenticatedUser, issueController.getIssuesByProject);
router.patch("/:issueId", authenticatedUser, issueController.updateIssue);
router.post("/:issueId/comments", authenticatedUser, issueController.addComment);
router.get("/:issueId/comments", authenticatedUser, issueController.getCommentsByIssue);


export default router;
