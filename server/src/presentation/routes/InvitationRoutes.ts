import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { invitationController } from "@/infrastructure/DI/InvitationContatiner";

const router = Router();

router.post(
  "/:workspaceId/invite",
  authenticatedUser,
  invitationController.inviteUser,
);

router.post(
  "/invite/accept",
  authenticatedUser,
  invitationController.acceptInvitation,
);
export default router;
