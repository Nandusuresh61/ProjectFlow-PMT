import { GetWorkspaceActivityFeedUseCase } from "@/application/use-cases/Activity/GetWorkspaceActivityFeedUseCase";
import { GetEntityTimelineUseCase } from "@/application/use-cases/Activity/GetEntityTimelineUseCase";
import { WorkspaceActivityController } from "@/presentation/controllers/WorkspaceActivityController";
import { workspaceEventRepository } from "./WorkspaceEventContainer";
import { MembershipRepository } from "@/infrastructure/repositories/MembershipRepository";

const membershipRepository = new MembershipRepository();

const getWorkspaceActivityFeedUseCase = new GetWorkspaceActivityFeedUseCase(
  workspaceEventRepository,
  membershipRepository
);

const getEntityTimelineUseCase = new GetEntityTimelineUseCase(
  workspaceEventRepository
);

export const workspaceActivityController = new WorkspaceActivityController(
  getWorkspaceActivityFeedUseCase,
  getEntityTimelineUseCase
);
