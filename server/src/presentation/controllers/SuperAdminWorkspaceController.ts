import { Request, Response } from "express";
import { IGetAllWorkspacesUseCase } from "@/application/use-cases/Admin/GetAllWorkspacesUseCase";
import { IGetWorkspaceDetailsUseCase } from "@/application/use-cases/Admin/GetWorkspaceDetailsUseCase";
import { IToggleWorkspaceSuspensionUseCase } from "@/application/use-cases/Admin/ToggleWorkspaceSuspensionUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";

export class SuperAdminWorkspaceController {
  constructor(
    private readonly _getAllWorkspacesUseCase: IGetAllWorkspacesUseCase,
    private readonly _getWorkspaceDetailsUseCase: IGetWorkspaceDetailsUseCase,
    private readonly _toggleWorkspaceSuspensionUseCase: IToggleWorkspaceSuspensionUseCase,
  ) { }

  getAllWorkspaces = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const result = await this._getAllWorkspacesUseCase.execute({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.WORKSPACE_FETCHED_SUCCESSFULLY, result));
  });

  getWorkspaceDetails = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const result = await this._getWorkspaceDetailsUseCase.execute(workspaceId);

    if (!result) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.WORKSPACE_FETCHED_SUCCESSFULLY, result));
  });

  toggleWorkspaceSuspension = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    await this._toggleWorkspaceSuspensionUseCase.execute(workspaceId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.WORKSPACE_STATUS_UPDATED, null));
  });
}
