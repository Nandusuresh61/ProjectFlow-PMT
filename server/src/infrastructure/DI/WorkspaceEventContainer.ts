import { MongoWorkspaceEventRepository } from "@/infrastructure/repositories/MongoWorkspaceEventRepository";
import { WorkspaceEventTrackingService } from "@/application/services/WorkspaceEventTrackingService";

export const workspaceEventRepository = new MongoWorkspaceEventRepository();
export const workspaceEventTrackingService = new WorkspaceEventTrackingService(workspaceEventRepository);
