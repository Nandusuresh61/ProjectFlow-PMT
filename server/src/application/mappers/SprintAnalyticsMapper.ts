import {
  ProjectVelocityDto,
  SprintAnalyticsDto,
  SprintPerformanceSummaryDto,
} from "@/application/dtos/SprintAnalyticsDto";
import { SprintMetricsSnapshot } from "@/application/interfaces/services/ISprintMetricsCalculatorService";
import { SprintAnalytics } from "@/domain/entities/SprintAnalytics";

export class SprintAnalyticsMapper {
  static toDTO(analytics: SprintAnalytics): SprintAnalyticsDto {
    return {
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
      isSnapshot: true,
    };
  }

  static toLiveDTO(
    metrics: SprintMetricsSnapshot,
    workspaceId: string,
  ): SprintAnalyticsDto {
    return {
      analyticsId: null,
      sprintId: metrics.sprintId,
      projectId: metrics.projectId,
      workspaceId,
      sprintName: metrics.sprintName,
      sprintGoal: metrics.sprintGoal,
      startedAt: metrics.startedAt,
      completedAt: null,
      committedIssues: metrics.committedIssues,
      completedIssues: metrics.completedIssues,
      incompleteIssues: metrics.incompleteIssues,
      committedStoryPoints: metrics.committedStoryPoints,
      completedStoryPoints: metrics.completedStoryPoints,
      spilloverStoryPoints: metrics.spilloverStoryPoints,
      committedEstimatedHours: metrics.committedEstimatedHours,
      loggedHours: metrics.loggedHours,
      remainingHours: metrics.remainingHours,
      completionRate: metrics.completionRate,
      velocity: metrics.velocity,
      scopeChangeCount: metrics.scopeChangeCount,
      createdAt: null,
      isSnapshot: false,
    };
  }

  static toProjectVelocityDTO(
    projectId: string,
    analytics: SprintAnalytics[],
    averageVelocity: number,
  ): ProjectVelocityDto {
    return {
      projectId,
      averageVelocity,
      sprints: analytics.map((item) => ({
        sprintId: item.sprintId,
        sprintName: item.sprintName,
        completedAt: item.completedAt,
        committedStoryPoints: item.committedStoryPoints,
        completedStoryPoints: item.completedStoryPoints,
        velocity: item.velocity,
      })),
    };
  }

  static toPerformanceSummaryDTO(
    projectId: string,
    analytics: SprintAnalytics[],
    averageVelocity: number,
  ): SprintPerformanceSummaryDto {
    return {
      projectId,
      averageVelocity,
      totalSprints: analytics.length,
      sprints: analytics.map((item) => this.toDTO(item)),
    };
  }
}
