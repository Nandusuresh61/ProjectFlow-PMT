import { Router } from "express";
import { notificationController } from "@/infrastructure/DI/NotificationContainer";
import { authenticatedUser } from "@/presentation/middlewares/AuthMiddleware";

const router = Router();

router.use(authenticatedUser);

router.delete("/history", notificationController.clearHistory.bind(notificationController));
router.get("/", notificationController.getUserNotifications.bind(notificationController));
router.get("/unread-count", notificationController.getUnreadCount.bind(notificationController));
router.patch("/:id/read", notificationController.markAsRead.bind(notificationController));

export default router;
