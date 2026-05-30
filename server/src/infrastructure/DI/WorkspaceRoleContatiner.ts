
import { WorkspaceRoleMiddleware } from "@/presentation/middlewares/WorkspaceRoleMiddleware";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";

const membershipRepo = new MembershipRepository;
const workspaceRepo = new WorkspaceRepository();

export const workspaceRoleMiddleware = new WorkspaceRoleMiddleware(
  membershipRepo,
  workspaceRepo
);