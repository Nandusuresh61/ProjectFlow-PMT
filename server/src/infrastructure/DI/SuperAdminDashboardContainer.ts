import { GetSuperAdminDashboardUseCase } from "@/application/use-cases/Admin/GetSuperAdminDashboardUseCase";
import { SuperAdminDashboardController } from "@/presentation/controllers/SuperAdminDashboardController";

const getSuperAdminDashboardUseCase = new GetSuperAdminDashboardUseCase();

export const superAdminDashboardController = new SuperAdminDashboardController(
  getSuperAdminDashboardUseCase
);
