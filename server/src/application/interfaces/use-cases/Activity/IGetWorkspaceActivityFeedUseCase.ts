import { WorkspaceEvent } from "../../../../domain/entities/WorkspaceEvent";

export interface IGetWorkspaceActivityFeedUseCase {
  execute(
    userId: string,
    workspaceId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]>;
}
