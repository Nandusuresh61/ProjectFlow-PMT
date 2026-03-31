import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { issueController } from "@/infrastructure/DI/IssueContainer";

const router = Router();


router.post("/", authenticatedUser, issueController.createIssue);


export default router;
