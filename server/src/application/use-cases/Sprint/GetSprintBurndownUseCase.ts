import { IGetSprintBurndownUseCase, BurndownMetricResponse } from "@/application/interfaces/use-cases/Sprint/IGetSprintBurndownUseCase";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { ISprintDailyMetricRepository } from "@/application/interfaces/repositories/ISprintDailyMetricRepository";
import { BurndownIdealLineCalculator } from "@/application/utils/BurndownIdealLineCalculator";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetSprintBurndownUseCase implements IGetSprintBurndownUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _metricRepo: ISprintDailyMetricRepository
  ) {}

  async execute(sprintId: string): Promise<BurndownMetricResponse> {
    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.TARGET_SPRINT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (!sprint.startDate || !sprint.endDate) {
      throw new AppError(ErrorCode.VALIDATION, "Sprint dates are not set", HttpStatusCode.BAD_REQUEST);
    }

    const historicalMetrics = await this._metricRepo.findBySprintId(sprintId);
    
    // Get latest metric for current stats
    const latestMetric = historicalMetrics.length > 0 
      ? historicalMetrics[historicalMetrics.length - 1] 
      : null;

    // Use the maximum estimated hours found in metrics for the ideal line baseline
    // or current sprint planned points if hours are not available.
    // However, user specifically asked for hours.
    const maxEstimated = Math.max(...historicalMetrics.map(m => m.totalEstimatedHours), 0);

    const idealLine = BurndownIdealLineCalculator.calculate(
      sprint.startDate,
      sprint.endDate,
      maxEstimated
    );

    const actualLine = historicalMetrics.map(m => ({
      date: m.date,
      remainingHours: m.totalRemainingHours
    }));

    return {
      sprintId,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      idealLine,
      actualLine,
      metrics: {
        totalEstimatedHours: latestMetric?.totalEstimatedHours || 0,
        currentRemainingHours: latestMetric?.totalRemainingHours || 0,
        loggedHours: latestMetric?.totalLoggedHours || 0,
        completedTasks: latestMetric?.completedTasks || 0,
        incompleteTasks: latestMetric?.incompleteTasks || 0
      }
    };
  }
}
