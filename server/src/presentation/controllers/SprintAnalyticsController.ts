import { IGetProjectVelocityUseCase } from "@/application/interfaces/use-cases/Analytics/IGetProjectVelocityUseCase";
import { IGetSprintAnalyticsUseCase } from "@/application/interfaces/use-cases/Analytics/IGetSprintAnalyticsUseCase";
import { IGetSprintPerformanceSummaryUseCase } from "@/application/interfaces/use-cases/Analytics/IGetSprintPerformanceSummaryUseCase";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { asyncHandler } from "../utils/AsyncHandler";

export class SprintAnalyticsController {
  constructor(
    private readonly _getSprintAnalyticsUseCase: IGetSprintAnalyticsUseCase,
    private readonly _getProjectVelocityUseCase: IGetProjectVelocityUseCase,
    private readonly _getSprintPerformanceSummaryUseCase: IGetSprintPerformanceSummaryUseCase,
  ) {}

  getSprintAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const sprintId = req.params.sprintId as string;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getSprintAnalyticsUseCase.execute(userId, sprintId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.SPRINT_ANALYTICS_RETRIEVED_SUCCESS, result));
  });

  getProjectVelocity = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const projectId = req.params.projectId as string;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getProjectVelocityUseCase.execute(userId, projectId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.SPRINT_ANALYTICS_RETRIEVED_SUCCESS, result));
  });

  getSprintPerformanceSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const projectId = req.params.projectId as string;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getSprintPerformanceSummaryUseCase.execute(userId, projectId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.SPRINT_ANALYTICS_RETRIEVED_SUCCESS, result));
  });
}
