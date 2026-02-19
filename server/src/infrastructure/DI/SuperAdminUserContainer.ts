import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { SuperAdminUserController } from "@/presentation/controllers/SuperAdminUserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";

const userRepo = new MongoUserRepository();
const getAllUsersWithWorkspace = new GetAllUsersWithWorkspaceUseCase(
  userRepo,
);

export const superAdminUserController = new SuperAdminUserController(
  getAllUsersWithWorkspace,
);
