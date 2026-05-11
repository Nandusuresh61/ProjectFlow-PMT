import { SprintPerformanceSummaryDto } from "@/application/dtos/SprintAnalyticsDto";

export interface IGetSprintPerformanceSummaryUseCase {
  execute(userId: string, projectId: string): Promise<SprintPerformanceSummaryDto>;
}
