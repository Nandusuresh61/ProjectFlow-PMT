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

router.get(
  "/invite/details/:token",
  invitationController.getInvitationDetails,
);

export default router;
