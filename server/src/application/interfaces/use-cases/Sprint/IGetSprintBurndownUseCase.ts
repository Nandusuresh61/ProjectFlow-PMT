export interface BurndownMetricResponse {
  sprintId: string;
  startDate: Date;
  endDate: Date;
  idealLine: { date: Date; remainingHours: number }[];
  actualLine: { date: Date; remainingHours: number }[];
  metrics: {
    totalEstimatedHours: number;
    currentRemainingHours: number;
    loggedHours: number;
    completedTasks: number;
    incompleteTasks: number;
  };
}

export interface IGetSprintBurndownUseCase {
  execute(sprintId: string): Promise<BurndownMetricResponse>;
}
