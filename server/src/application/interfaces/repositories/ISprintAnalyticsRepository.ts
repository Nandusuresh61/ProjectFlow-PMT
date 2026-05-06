import { SprintAnalytics } from "@/domain/entities/SprintAnalytics";

export interface ISprintAnalyticsRepository {
  create(analytics: SprintAnalytics): Promise<SprintAnalytics>;
  findBySprintId(sprintId: string): Promise<SprintAnalytics | null>;
  findByProjectId(projectId: string): Promise<SprintAnalytics[]>;
  findRecentByProjectId(projectId: string, limit: number): Promise<SprintAnalytics[]>;
  getAverageVelocity(projectId: string, limit?: number): Promise<number>;
}
