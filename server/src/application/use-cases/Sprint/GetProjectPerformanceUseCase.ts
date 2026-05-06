import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { IGetProjectPerformanceUseCase, IGetProjectPerformanceUseCaseResponse } from "@/application/interfaces/use-cases/Sprint/IGetProjectPerformanceUseCase";

export class GetProjectPerformanceUseCase implements IGetProjectPerformanceUseCase {
  constructor(
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
  ) { }

  async execute(userId: string, projectId: string): Promise<IGetProjectPerformanceUseCaseResponse> {
    const completedSprints = (await this._sprintAnalyticsRepo.findRecentByProjectId(projectId, 5)).reverse();

    if (completedSprints.length === 0) {
      return {
        velocityBars: [],
        metrics: [
          { label: "Velocity", value: "0 pts", trend: "0", up: true },
          { label: "Completion Rate", value: "0%", trend: "0%", up: true },
          { label: "Avg Cycle Time", value: "0d", trend: "0d", up: true },
          { label: "Bug Rate", value: "0%", trend: "0%", up: true },
        ],
      };
    }

    const velocityBars = completedSprints.map(s => ({
      sprint: s.sprintName.length > 5 ? s.sprintName.substring(0, 5) : s.sprintName,
      planned: s.committedStoryPoints || 0,
      completed: s.completedStoryPoints || 0,
    }));

    const recentSprints = completedSprints.slice(-3);
    const avgVelocity = Math.round(recentSprints.reduce((sum, s) => sum + (s.velocity || 0), 0) / recentSprints.length);

    const avgCompletionRate = Math.round(
      recentSprints.reduce((sum, s) => sum + (s.completionRate || 0), 0) / recentSprints.length
    );

    const avgLoggedHours = Math.round(recentSprints.reduce((sum, s) => sum + (s.loggedHours || 0), 0) / recentSprints.length);
    const avgRemainingHours = Math.round(recentSprints.reduce((sum, s) => sum + (s.remainingHours || 0), 0) / recentSprints.length);

    return {
      velocityBars,
      metrics: [
        { label: "Velocity", value: `${avgVelocity} pts`, trend: "+0", up: true },
        { label: "Completion Rate", value: `${avgCompletionRate}%`, trend: "+0%", up: true },
        { label: "Logged Hours", value: `${avgLoggedHours}h`, trend: "+0h", up: true },
        { label: "Remaining Hours", value: `${avgRemainingHours}h`, trend: "-0h", up: true },
      ],
    };
  }
}
