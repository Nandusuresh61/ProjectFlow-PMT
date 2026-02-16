import { GetAllUsersWithOrganizationUseCase } from "@/application/use-cases/Admin/GetAllUserWithOrganizationUsecase";
import { Router } from "express";
import { authenticatedUser } from "../middlewares/AuthMiddleware";
import { superAdminOnly } from "../middlewares/AdminMiddleware";
import { superAdminUserController } from "@/infrastructure/DI/SuperAdminUserContainer";

const router = Router();

router.get(
  "/getusers",
  authenticatedUser,
  superAdminOnly,
  superAdminUserController.getAllUsersWithOrganizations
);

export default router;