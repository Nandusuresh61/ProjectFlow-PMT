import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { GetUserDetailsUseCase } from "@/application/use-cases/Admin/GetUserDetailsUseCase";
import { ToggleUserBlockUseCase } from "@/application/use-cases/Admin/ToggleUserBlockUseCase";
import { SuperAdminUserController } from "@/presentation/controllers/SuperAdminUserController";
import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();
const getAllUsersWithWorkspace = new GetAllUsersWithWorkspaceUseCase(
  userRepo,
);
const getUserDetailsUseCase = new GetUserDetailsUseCase(userRepo);
const toggleUserBlockUseCase = new ToggleUserBlockUseCase(userRepo);

export const superAdminUserController = new SuperAdminUserController(
  getAllUsersWithWorkspace,
  getUserDetailsUseCase,
  toggleUserBlockUseCase
);
