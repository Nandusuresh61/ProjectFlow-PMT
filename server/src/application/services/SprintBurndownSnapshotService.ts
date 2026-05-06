import { ISprintBurndownSnapshotService } from "@/application/interfaces/services/ISprintBurndownSnapshotService";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { ISprintDailyMetricRepository } from "@/application/interfaces/repositories/ISprintDailyMetricRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { SprintDailyMetric } from "@/domain/entities/SprintDailyMetric";

export class SprintBurndownSnapshotService implements ISprintBurndownSnapshotService {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _workLogRepo: IWorkLogRepository,
    private readonly _metricRepo: ISprintDailyMetricRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async captureSnapshot(sprintId: string): Promise<void> {
    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) return;

    // Use only TASK and BUG for burndown
    const issues = await this._issueRepo.findBySprintId(sprintId);
    const engineeringIssues = issues.filter(i => i.type === "TASK" || i.type === "BUG");
    const storyIssues = issues.filter(i => i.type === "STORY");

    const totalEstimatedHours = engineeringIssues.reduce((sum, i) => sum + (i.estimatedHours || 0), 0);
    const totalRemainingHours = engineeringIssues.reduce((sum, i) => sum + (i.remainingHours || 0), 0);
    
    const issueIds = engineeringIssues.map(i => i.issueId);
    const totalLoggedHours = await this._workLogRepo.getTotalLoggedHoursByIssueIds(issueIds);
    const totalLogged = Object.values(totalLoggedHours).reduce((sum, h) => sum + h, 0);

    const completedTasks = engineeringIssues.filter(i => i.status === "DONE").length;
    const incompleteTasks = engineeringIssues.length - completedTasks;
    
    const completedStoryPoints = storyIssues
      .filter(i => i.status === "DONE")
      .reduce((sum, i) => sum + (i.storyPoints || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metric = new SprintDailyMetric(
      this._uidGenerator.createId(),
      sprintId,
      sprint.projectId,
      "", // workspaceId will be set from sprint's project if needed, but let's just use empty for now or fetch project
      today,
      totalEstimatedHours,
      totalLogged,
      totalRemainingHours,
      completedTasks,
      incompleteTasks,
      completedStoryPoints
    );

    // Fetch workspaceId if missing (optional but better)
    // Actually sprint entity doesn't have workspaceId, but we can get it from first issue or project
    if (issues.length > 0) {
      (metric as any).workspaceId = issues[0].workspaceId;
    }

    await this._metricRepo.upsertDailyMetric(metric);
  }
}
