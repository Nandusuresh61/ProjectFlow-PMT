import { WorkspaceEvent } from "@/domain/entities/WorkspaceEvent";

export interface IWorkspaceEventRepository {
  save(event: WorkspaceEvent): Promise<void>;
  
  getWorkspaceFeed(
    workspaceId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]>;
  
  getEntityTimeline(
    entityId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]>;
}
