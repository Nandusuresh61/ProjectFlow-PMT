import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { GetUserDetailsUseCase } from "@/application/use-cases/Admin/GetUserDetailsUseCase";
import { SuperAdminUserController } from "@/presentation/controllers/SuperAdminUserController";
import { MongoUserRepository } from "../repositories/MongoUserRepository";

const userRepo = new MongoUserRepository();
const getAllUsersWithWorkspace = new GetAllUsersWithWorkspaceUseCase(
  userRepo,
);
const getUserDetailsUseCase = new GetUserDetailsUseCase(userRepo);

export const superAdminUserController = new SuperAdminUserController(
  getAllUsersWithWorkspace,
  getUserDetailsUseCase,
);
