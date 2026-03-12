
import { WorkspaceRoleMiddleware } from "@/presentation/middlewares/WorkspaceRoleMiddleware";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";

const membershipRepo = new MembershipRepository;
const workspaceRepo = new WorkspaceRepository();

export const workspaceRoleMiddleware = new WorkspaceRoleMiddleware(
  membershipRepo,
  workspaceRepo
);