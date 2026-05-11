import { SprintAnalyticsDto } from "@/application/dtos/SprintAnalyticsDto";

export interface IGetSprintAnalyticsUseCase {
  execute(userId: string, sprintId: string): Promise<SprintAnalyticsDto>;
}
