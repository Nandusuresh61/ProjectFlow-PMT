import { CreateProjectUseCase } from "@/application/use-cases/Project/CreateProjectUseCase";
import { GetWorkspaceProjectsUseCase } from "@/application/use-cases/Project/GetWorkspaceProjectsUseCase";
import { GetProjectMembersUseCase } from "@/application/use-cases/Project/GetProjectMembersUseCase";
import { GetProjectOverviewUseCase } from "@/application/use-cases/Project/GetProjectOverviewUseCase";
import { UpdateProjectUseCase } from "@/application/use-cases/Project/UpdateProjectUseCase";
import { ProjectController } from "@/presentation/controllers/ProjectController";
import { MembershipRepository } from "@/infrastructure/repositories/MembershipRepository";
import { PlanRepository } from "@/infrastructure/repositories/PlanRepository";
import { ProjectRepository } from "@/infrastructure/repositories/ProjectRepository";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { IssueRepository } from "@/infrastructure/repositories/IssueRepository";
import { WorkspaceRepository } from "@/infrastructure/repositories/WorkspaceRepository";
import { UidService } from "@/infrastructure/services/UidService";

import { workspaceEventTrackingService } from "./WorkspaceEventContainer";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const planRepo = new PlanRepository();
const projectRepo = new ProjectRepository();
const userRepo = new UserRepository();
const issueRepo = new IssueRepository();
const uidGenerator = new UidService();

const createProjectUseCase = new CreateProjectUseCase(
  workspaceRepo,
  membershipRepo,
  planRepo,
  projectRepo,
  uidGenerator,
  workspaceEventTrackingService
);
const getWorkspaceProjectsUseCase = new GetWorkspaceProjectsUseCase(
  workspaceRepo,
  membershipRepo,
  projectRepo
);
const updateProjectUseCase = new UpdateProjectUseCase(
  projectRepo,
  workspaceRepo,
  membershipRepo,
  planRepo,
  workspaceEventTrackingService
);
const getProjectMembersUseCase = new GetProjectMembersUseCase(
  projectRepo,
  userRepo,
  membershipRepo,
  issueRepo
);

const getProjectOverviewUseCase = new GetProjectOverviewUseCase(
  projectRepo,
  issueRepo,
  userRepo,
  membershipRepo
);

export const projectController = new ProjectController(
  createProjectUseCase,
  getWorkspaceProjectsUseCase,
  updateProjectUseCase,
  getProjectMembersUseCase,
  getProjectOverviewUseCase
);
