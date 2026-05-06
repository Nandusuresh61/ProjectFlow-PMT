export class SprintDailyMetric {
  constructor(
    public readonly metricId: string,
    public readonly sprintId: string,
    public readonly projectId: string,
    public readonly workspaceId: string,
    public readonly date: Date,
    public totalEstimatedHours: number,
    public totalLoggedHours: number,
    public totalRemainingHours: number,
    public completedTasks: number,
    public incompleteTasks: number,
    public completedStoryPoints: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
