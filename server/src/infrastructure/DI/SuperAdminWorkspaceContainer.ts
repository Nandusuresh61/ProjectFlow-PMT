import { GetAllWorkspacesUseCase } from "@/application/use-cases/Admin/GetAllWorkspacesUseCase";
import { GetWorkspaceDetailsUseCase } from "@/application/use-cases/Admin/GetWorkspaceDetailsUseCase";
import { ToggleWorkspaceSuspensionUseCase } from "@/application/use-cases/Admin/ToggleWorkspaceSuspensionUseCase";
import { SuperAdminWorkspaceController } from "@/presentation/controllers/SuperAdminWorkspaceController";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";

const workspaceRepo = new WorkspaceRepository();

const getAllWorkspacesUseCase = new GetAllWorkspacesUseCase(workspaceRepo);
const getWorkspaceDetailsUseCase = new GetWorkspaceDetailsUseCase(workspaceRepo);
const toggleWorkspaceSuspensionUseCase = new ToggleWorkspaceSuspensionUseCase(workspaceRepo);

export const superAdminWorkspaceController = new SuperAdminWorkspaceController(
  getAllWorkspacesUseCase,
  getWorkspaceDetailsUseCase,
  toggleWorkspaceSuspensionUseCase
);
