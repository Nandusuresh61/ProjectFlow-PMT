import { CreateProjectUseCase } from "@/application/use-cases/Project/CreateProjectUseCase";
import { GetWorkspaceProjectsUseCase } from "@/application/use-cases/Project/GetWorkspaceProjectsUseCase";
import { GetProjectMembersUseCase } from "@/application/use-cases/Project/GetProjectMembersUseCase";
import { GetProjectOverviewUseCase } from "@/application/use-cases/Project/GetProjectOverviewUseCase";
import { UpdateProjectUseCase } from "@/application/use-cases/Project/UpdateProjectUseCase";
import { ProjectController } from "@/presentation/controllers/ProjectController";
import { MembershipRepository } from "@/infrastructure/repositories/MongoMembershipRepository";
import { MongoPlanRepository } from "@/infrastructure/repositories/MongoPlanRepository";
import { MongoProjectRepository } from "@/infrastructure/repositories/MongoProjectRepository";
import { MongoUserRepository } from "@/infrastructure/repositories/MongoUserRepository";
import { MongoIssueRepository } from "@/infrastructure/repositories/MongoIssueRepository";
import { WorkspaceRepository } from "@/infrastructure/repositories/MongoWorkspaceRepository";
import { UidService } from "@/infrastructure/services/UidService";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const planRepo = new MongoPlanRepository();
const projectRepo = new MongoProjectRepository();
const userRepo = new MongoUserRepository();
const issueRepo = new MongoIssueRepository();
const uidGenerator = new UidService();

const createProjectUseCase = new CreateProjectUseCase(
  workspaceRepo,
  membershipRepo,
  planRepo,
  projectRepo,
  uidGenerator
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
  planRepo
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
