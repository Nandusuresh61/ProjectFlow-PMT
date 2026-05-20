import { Request, Response } from "express";
import { GetSuperAdminDashboardUseCase } from "@/application/use-cases/Admin/GetSuperAdminDashboardUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";

export class SuperAdminDashboardController {
  constructor(
    private readonly _getSuperAdminDashboardUseCase: GetSuperAdminDashboardUseCase
  ) {}

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this._getSuperAdminDashboardUseCase.getStats();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Dashboard statistics retrieved successfully", stats));
  });

  getRevenueOverview = asyncHandler(async (req: Request, res: Response) => {
    const revenue = await this._getSuperAdminDashboardUseCase.getRevenueOverview();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Revenue overview retrieved successfully", revenue));
  });

  getWorkspaceGrowth = asyncHandler(async (req: Request, res: Response) => {
    const growth = await this._getSuperAdminDashboardUseCase.getWorkspaceGrowth();
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Workspace growth retrieved successfully", growth));
  });

  getRecentWorkspaces = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this._getSuperAdminDashboardUseCase.getRecentWorkspaces(page, limit);
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Recent workspaces retrieved successfully", result));
  });

  getPendingTickets = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await this._getSuperAdminDashboardUseCase.getPendingTickets(page, limit);
    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Pending tickets retrieved successfully", result));
  });
}
