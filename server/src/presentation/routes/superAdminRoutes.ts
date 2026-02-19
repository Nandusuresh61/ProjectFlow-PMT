import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { superAdminOnly } from "../middlewares/AdminMiddleware";
import { superAdminUserController } from "@/infrastructure/DI/SuperAdminUserContainer";

const router = Router();

router.get(
  "/getusers",
  authenticatedUser,
  superAdminOnly,
  superAdminUserController.getAllUsersWithWorkspaces
);

export default router;