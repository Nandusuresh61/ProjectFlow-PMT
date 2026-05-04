import { Router } from "express";
import { subscriptionController } from "@/infrastructure/DI/SubscriptionContainer";
import { authenticatedUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/:workspaceId", authenticatedUser, subscriptionController.getSubscription);
router.post("/:workspaceId/upgrade", authenticatedUser, subscriptionController.upgrade);
router.post("/:workspaceId/verify", authenticatedUser, subscriptionController.verifyPayment);

export default router;
