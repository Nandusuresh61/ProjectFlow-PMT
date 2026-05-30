import { GetWorkspaceMembersUseCase } from "@/application/use-cases/workspace/GetWorkspaceMembersUseCase";
import { GetUserWorkspacesUseCase } from "@/application/use-cases/workspace/GetUserWorkspacesUseCase";
import { SwitchWorkspaceUseCase } from "@/application/use-cases/workspace/SwitchWorkspaceUseCase";
import { CreateWorkspaceUseCase } from "@/application/use-cases/workspace/CreateWorkspaceUseCase";
import { CheckWorkspaceNameUseCase } from "@/application/use-cases/workspace/CheckWorkspaceNameUseCase";
import { GetWorkspaceDashboardDataUseCase } from "@/application/use-cases/workspace/GetWorkspaceDashboardDataUseCase";
import { WorkspaceController } from "@/presentation/controllers/WorkspaceController";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { UserRepository } from "../repositories/UserRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { PlanRepository } from "../repositories/PlanRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { IssueRepository } from "../repositories/IssueRepository";
import { UidService } from "../services/UidService";
import { subscriptionRepo } from "./SubscriptionContainer";


const membershipRepo = new MembershipRepository();
const userRepo = new UserRepository();
const workspaceRepo = new WorkspaceRepository();
const planRepo = new PlanRepository();
const projectRepo = new ProjectRepository();
const issueRepo = new IssueRepository();
const uidGenerator = new UidService();

const getWorkspaceMembersUseCase = new GetWorkspaceMembersUseCase(
  membershipRepo,
  userRepo
);
const getUserWorkspacesUseCase = new GetUserWorkspacesUseCase(
  membershipRepo,
  workspaceRepo
);
const switchWorkspaceUseCase = new SwitchWorkspaceUseCase(
  userRepo,
  membershipRepo
);
const createWorkspaceUseCase = new CreateWorkspaceUseCase(
  userRepo,
  workspaceRepo,
  membershipRepo,
  planRepo,
  subscriptionRepo,
  uidGenerator
);

const checkWorkspaceNameUseCase = new CheckWorkspaceNameUseCase(workspaceRepo);
const getDashboardDataUseCase = new GetWorkspaceDashboardDataUseCase(projectRepo, issueRepo, membershipRepo);

export const workspaceController = new WorkspaceController(
  getWorkspaceMembersUseCase,
  getUserWorkspacesUseCase,
  switchWorkspaceUseCase,
  createWorkspaceUseCase,
  checkWorkspaceNameUseCase,
  getDashboardDataUseCase,
  membershipRepo,
  workspaceRepo
);