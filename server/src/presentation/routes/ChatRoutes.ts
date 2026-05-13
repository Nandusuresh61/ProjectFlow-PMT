import { Router } from "express";
import { chatController } from "@/infrastructure/DI/ChatContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/messages/:roomId", authenticatedUser, (req, res, next) => 
  chatController.getMessages(req, res, next)
);

router.get("/conversations/:workspaceId", authenticatedUser, (req, res, next) =>
  chatController.getConversations(req, res, next)
);

export default router;
