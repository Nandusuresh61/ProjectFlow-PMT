import { Request, Response } from "express";
import { IGetSuperAdminDashboardUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IGetSuperAdminDashboardUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";

export class SuperAdminDashboardController {
  constructor(
    private readonly _getSuperAdminDashboardUseCase: IGetSuperAdminDashboardUseCase
  ) {}

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this._getSuperAdminDashboardUseCase.getStats();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.DASHBOARD_STATS_RETRIEVED, stats));
  });

  getRevenueOverview = asyncHandler(async (req: Request, res: Response) => {
    const revenue = await this._getSuperAdminDashboardUseCase.getRevenueOverview();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.DASHBOARD_REVENUE_RETRIEVED, revenue));
  });

  getWorkspaceGrowth = asyncHandler(async (req: Request, res: Response) => {
    const growth = await this._getSuperAdminDashboardUseCase.getWorkspaceGrowth();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.DASHBOARD_GROWTH_RETRIEVED, growth));
  });

  getRecentWorkspaces = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this._getSuperAdminDashboardUseCase.getRecentWorkspaces(page, limit);
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.DASHBOARD_WORKSPACES_RETRIEVED, result));
  });

  getPendingTickets = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this._getSuperAdminDashboardUseCase.getPendingTickets(page, limit);
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.DASHBOARD_TICKETS_RETRIEVED, result));
  });
}
