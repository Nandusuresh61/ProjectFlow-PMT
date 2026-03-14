import { GetWorkspaceMembersUseCase } from "@/application/use-cases/workspace/GetWorkspaceMembersUseCase";
import { WorkspaceController } from "@/presentation/controllers/WorkspaceController";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";


const membershipRepo = new MembershipRepository();
const userRepo = new MongoUserRepository();
const getWorkspaceMembersUseCase = new GetWorkspaceMembersUseCase(
  membershipRepo,
  userRepo
);

export const workspaceController = new WorkspaceController(
  getWorkspaceMembersUseCase
);