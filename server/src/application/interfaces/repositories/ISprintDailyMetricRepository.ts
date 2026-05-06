import { SprintDailyMetric } from "@/domain/entities/SprintDailyMetric";

export interface ISprintDailyMetricRepository {
  create(metric: SprintDailyMetric): Promise<SprintDailyMetric>;
  update(metricId: string, metric: Partial<SprintDailyMetric>): Promise<SprintDailyMetric | null>;
  upsertDailyMetric(metric: SprintDailyMetric): Promise<SprintDailyMetric>;
  findBySprintId(sprintId: string): Promise<SprintDailyMetric[]>;
  findBySprintAndDate(sprintId: string, date: Date): Promise<SprintDailyMetric | null>;
  findDateRange(sprintId: string, startDate: Date, endDate: Date): Promise<SprintDailyMetric[]>;
}
