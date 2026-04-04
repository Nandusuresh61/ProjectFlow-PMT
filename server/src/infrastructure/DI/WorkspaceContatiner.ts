import { GetWorkspaceMembersUseCase } from "@/application/use-cases/workspace/GetWorkspaceMembersUseCase";
import { GetUserWorkspacesUseCase } from "@/application/use-cases/workspace/GetUserWorkspacesUseCase";
import { SwitchWorkspaceUseCase } from "@/application/use-cases/workspace/SwitchWorkspaceUseCase";
import { CreateWorkspaceUseCase } from "@/application/use-cases/workspace/CreateWorkspaceUseCase";
import { CheckWorkspaceNameUseCase } from "@/application/use-cases/workspace/CheckWorkspaceNameUseCase";
import { WorkspaceController } from "@/presentation/controllers/WorkspaceController";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { UidService } from "../services/UidService";


const membershipRepo = new MembershipRepository();
const userRepo = new MongoUserRepository();
const workspaceRepo = new WorkspaceRepository();
const planRepo = new MongoPlanRepository();
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
  uidGenerator
);

const checkWorkspaceNameUseCase = new CheckWorkspaceNameUseCase(workspaceRepo);

export const workspaceController = new WorkspaceController(
  getWorkspaceMembersUseCase,
  getUserWorkspacesUseCase,
  switchWorkspaceUseCase,
  createWorkspaceUseCase,
  checkWorkspaceNameUseCase
);