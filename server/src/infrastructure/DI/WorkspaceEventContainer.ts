import { WorkspaceEventRepository } from "@/infrastructure/repositories/WorkspaceEventRepository";
import { WorkspaceEventTrackingService } from "@/application/services/WorkspaceEventTrackingService";

export const workspaceEventRepository = new WorkspaceEventRepository();
export const workspaceEventTrackingService = new WorkspaceEventTrackingService(workspaceEventRepository);
