import { WorkspaceEvent } from "../../../../domain/entities/WorkspaceEvent";

export interface IGetEntityTimelineUseCase {
  execute(
    userId: string,
    entityId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]>;
}
