import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { SprintAnalytics } from "@/domain/entities/SprintAnalytics";
import {
  ISprintAnalyticsDocument,
  SprintAnalyticsModel,
} from "@/infrastructure/database/models/MongoSprintAnalyticsModel";
import { PipelineStage } from "mongoose";

export class SprintAnalyticsRepository implements ISprintAnalyticsRepository {
  async create(analytics: SprintAnalytics): Promise<SprintAnalytics> {
    const created = await SprintAnalyticsModel.create({
      analyticsId: analytics.analyticsId,
      sprintId: analytics.sprintId,
      projectId: analytics.projectId,
      workspaceId: analytics.workspaceId,
      sprintName: analytics.sprintName,
      sprintGoal: analytics.sprintGoal,
      startedAt: analytics.startedAt,
      completedAt: analytics.completedAt,
      committedIssues: analytics.committedIssues,
      completedIssues: analytics.completedIssues,
      incompleteIssues: analytics.incompleteIssues,
      committedStoryPoints: analytics.committedStoryPoints,
      completedStoryPoints: analytics.completedStoryPoints,
      spilloverStoryPoints: analytics.spilloverStoryPoints,
      committedEstimatedHours: analytics.committedEstimatedHours,
      loggedHours: analytics.loggedHours,
      remainingHours: analytics.remainingHours,
      completionRate: analytics.completionRate,
      velocity: analytics.velocity,
      scopeChangeCount: analytics.scopeChangeCount,
      createdAt: analytics.createdAt,
    });

    return this.toDomain(created);
  }

  async findBySprintId(sprintId: string): Promise<SprintAnalytics | null> {
    const doc = await SprintAnalyticsModel.findOne({ sprintId }).lean();
    if (!doc) return null;
    return this.toDomain(doc as ISprintAnalyticsDocument);
  }

  async findByProjectId(projectId: string): Promise<SprintAnalytics[]> {
    const docs = await SprintAnalyticsModel.find({ projectId })
      .sort({ completedAt: -1 })
      .lean();

    return docs.map((doc) => this.toDomain(doc as ISprintAnalyticsDocument));
  }

  async findRecentByProjectId(projectId: string, limit: number): Promise<SprintAnalytics[]> {
    const docs = await SprintAnalyticsModel.find({ projectId })
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();

    return docs.map((doc) => this.toDomain(doc as ISprintAnalyticsDocument));
  }

  async getAverageVelocity(projectId: string, limit?: number): Promise<number> {
    const pipeline: PipelineStage[] = [
      { $match: { projectId } },
      { $sort: { completedAt: -1 } },
    ];

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    pipeline.push({ $group: { _id: null, averageVelocity: { $avg: "$velocity" } } });

    const result = await SprintAnalyticsModel.aggregate(pipeline);
    return result.length > 0 ? Math.round(result[0].averageVelocity * 100) / 100 : 0;
  }

  private toDomain(doc: ISprintAnalyticsDocument): SprintAnalytics {
    return new SprintAnalytics(
      doc.analyticsId,
      doc.sprintId,
      doc.projectId,
      doc.workspaceId,
      doc.sprintName,
      doc.sprintGoal,
      doc.startedAt,
      doc.completedAt,
      doc.committedIssues,
      doc.completedIssues,
      doc.incompleteIssues,
      doc.committedStoryPoints,
      doc.completedStoryPoints,
      doc.spilloverStoryPoints,
      doc.committedEstimatedHours,
      doc.loggedHours,
      doc.remainingHours,
      doc.completionRate,
      doc.velocity,
      doc.scopeChangeCount,
      doc.createdAt,
    );
  }
}
