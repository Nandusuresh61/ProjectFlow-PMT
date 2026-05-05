import { Router } from "express";
import { chatController } from "@/infrastructure/DI/ChatContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/messages/:roomId", authenticatedUser as any, (req, res, next) => 
  chatController.getMessages(req, res, next)
);

export default router;
