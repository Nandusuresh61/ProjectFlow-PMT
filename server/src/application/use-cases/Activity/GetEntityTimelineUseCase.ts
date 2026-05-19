import { IGetEntityTimelineUseCase } from "@/application/interfaces/use-cases/Activity/IGetEntityTimelineUseCase";
import { IWorkspaceEventRepository } from "@/application/interfaces/repositories/IWorkspaceEventRepository";
import { WorkspaceEvent } from "@/domain/entities/WorkspaceEvent";

export class GetEntityTimelineUseCase implements IGetEntityTimelineUseCase {
  constructor(
    private readonly _eventRepo: IWorkspaceEventRepository
  ) {}

  async execute(
    userId: string, // Future: Use for access control based on entity type
    entityId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]> {
    return await this._eventRepo.getEntityTimeline(entityId, options);
  }
}
