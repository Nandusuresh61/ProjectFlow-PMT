import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IGetProjectPerformanceUseCase, IGetProjectPerformanceUseCaseResponse } from "@/application/interfaces/use-cases/Sprint/IGetProjectPerformanceUseCase";

export class GetProjectPerformanceUseCase implements IGetProjectPerformanceUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
  ) { }

  async execute(userId: string, projectId: string): Promise<IGetProjectPerformanceUseCaseResponse> {
    const sprints = await this._sprintRepo.findByProjectId(projectId);
    const completedSprints = sprints
      .filter(s => s.status === "COMPLETED")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .reverse();

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
      sprint: s.name.length > 5 ? s.name.substring(0, 5) : s.name,
      planned: s.plannedPoints || 0,
      completed: s.completedPoints || 0,
    }));

    const recentSprints = completedSprints.slice(-3);
    const avgVelocity = Math.round(recentSprints.reduce((sum, s) => sum + (s.completedPoints || 0), 0) / recentSprints.length);

    const avgCompletionRate = Math.round(
      (recentSprints.reduce((sum, s) => sum + ((s.completedPoints || 0) / (s.plannedPoints || 1)), 0) / recentSprints.length) * 100
    );

    const sprintIds = completedSprints.map(s => s.sprintId);
    let totalCycleTime = 0;
    let completedIssuesCount = 0;
    let bugCount = 0;
    let totalIssuesCount = 0;

    for (const sprintId of sprintIds) {
      const issues = await this._issueRepo.findBySprintId(sprintId);
      totalIssuesCount += issues.length;
      for (const issue of issues) {
        if (issue.type === "BUG") bugCount++;
        if (issue.status === "DONE") {
          completedIssuesCount++;
          const duration = issue.updatedAt.getTime() - issue.createdAt.getTime();
          totalCycleTime += duration;
        }
      }
    }

    const avgCycleTimeDays = completedIssuesCount > 0
      ? (totalCycleTime / completedIssuesCount / (1000 * 60 * 60 * 24)).toFixed(1)
      : "0";

    const bugRate = totalIssuesCount > 0 ? Math.round((bugCount / totalIssuesCount) * 100) : 0;

    return {
      velocityBars,
      metrics: [
        { label: "Velocity", value: `${avgVelocity} pts`, trend: "+0", up: true },
        { label: "Completion Rate", value: `${avgCompletionRate}%`, trend: "+0%", up: true },
        { label: "Avg Cycle Time", value: `${avgCycleTimeDays}d`, trend: "-0d", up: true },
        { label: "Bug Rate", value: `${bugRate}%`, trend: "-0%", up: true },
      ],
    };
  }
}
