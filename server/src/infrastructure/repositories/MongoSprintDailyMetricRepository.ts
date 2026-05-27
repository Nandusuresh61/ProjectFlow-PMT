import { ISprintDailyMetricRepository } from "@/application/interfaces/repositories/ISprintDailyMetricRepository";
import { SprintDailyMetric } from "@/domain/entities/SprintDailyMetric";
import { SprintDailyMetricModel, SprintDailyMetricDocument } from "../database/models/MongoSprintDailyMetricModel";

export class MongoSprintDailyMetricRepository implements ISprintDailyMetricRepository {
  async create(metric: SprintDailyMetric): Promise<SprintDailyMetric> {
    const created = await SprintDailyMetricModel.create({
      metricId: metric.metricId,
      sprintId: metric.sprintId,
      projectId: metric.projectId,
      workspaceId: metric.workspaceId,
      date: metric.date,
      totalEstimatedHours: metric.totalEstimatedHours,
      totalLoggedHours: metric.totalLoggedHours,
      totalRemainingHours: metric.totalRemainingHours,
      completedTasks: metric.completedTasks,
      incompleteTasks: metric.incompleteTasks,
      completedStoryPoints: metric.completedStoryPoints,
    });
    return this.toDomain(created);
  }

  async update(metricId: string, data: Partial<SprintDailyMetric>): Promise<SprintDailyMetric | null> {
    const updated = await SprintDailyMetricModel.findOneAndUpdate(
      { metricId },
      { $set: data },
      { returnDocument: "after" }
    ).lean();

    if (!updated) return null;
    return this.toDomain(updated as SprintDailyMetricDocument);
  }

  async upsertDailyMetric(metric: SprintDailyMetric): Promise<SprintDailyMetric> {
    // Normalize date to start of day for comparison
    const startOfDay = new Date(metric.date);
    startOfDay.setHours(0, 0, 0, 0);

    const updated = await SprintDailyMetricModel.findOneAndUpdate(
      { sprintId: metric.sprintId, date: startOfDay },
      { 
        $set: {
          totalEstimatedHours: metric.totalEstimatedHours,
          totalLoggedHours: metric.totalLoggedHours,
          totalRemainingHours: metric.totalRemainingHours,
          completedTasks: metric.completedTasks,
          incompleteTasks: metric.incompleteTasks,
          completedStoryPoints: metric.completedStoryPoints,
          updatedAt: new Date()
        },
        $setOnInsert: {
          metricId: metric.metricId,
          projectId: metric.projectId,
          workspaceId: metric.workspaceId,
          createdAt: new Date()
        }
      },
      { upsert: true, returnDocument: "after" }
    ).lean();

    return this.toDomain(updated as SprintDailyMetricDocument);
  }

  async findBySprintId(sprintId: string): Promise<SprintDailyMetric[]> {
    const docs = await SprintDailyMetricModel.find({ sprintId }).sort({ date: 1 }).lean();
    return docs.map(doc => this.toDomain(doc as SprintDailyMetricDocument));
  }

  async findBySprintAndDate(sprintId: string, date: Date): Promise<SprintDailyMetric | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const doc = await SprintDailyMetricModel.findOne({ sprintId, date: startOfDay }).lean();
    if (!doc) return null;
    return this.toDomain(doc as SprintDailyMetricDocument);
  }

  async findDateRange(sprintId: string, startDate: Date, endDate: Date): Promise<SprintDailyMetric[]> {
    const docs = await SprintDailyMetricModel.find({
      sprintId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();
    return docs.map(doc => this.toDomain(doc as SprintDailyMetricDocument));
  }

  private toDomain(doc: SprintDailyMetricDocument): SprintDailyMetric {
    return new SprintDailyMetric(
      doc.metricId,
      doc.sprintId,
      doc.projectId,
      doc.workspaceId,
      doc.date,
      doc.totalEstimatedHours,
      doc.totalLoggedHours,
      doc.totalRemainingHours,
      doc.completedTasks,
      doc.incompleteTasks,
      doc.completedStoryPoints,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
