import { Router } from "express";
import { notificationController } from "@/presentation/controllers/NotificationController";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";

const router = Router();

router.use(authenticatedUser);

router.get("/", notificationController.getUserNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/:id/read", notificationController.markAsRead);

export default router;
