import { GetAllUsersWithOrganizationUseCase } from "@/application/use-cases/Admin/GetAllUserWithOrganizationUsecase";
import { SuperAdminUserController } from "@/presentation/controllers/SuperAdminUserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";

const userRepo = new MongoUserRepository();
const getAllUsersWithOrganization = new GetAllUsersWithOrganizationUseCase(
  userRepo,
);

export const superAdminUserController = new SuperAdminUserController(
  getAllUsersWithOrganization,
);
