import { ICreateIssueUseCase } from "@/application/interfaces/use-cases/ICreateIssueUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { CreateIssueSchema } from "@/shared/schema/issue/CreateIssueSchema";
import { CreateIssueDto } from "@/application/dtos/IssueDto";

import { IGetIssuesByProjectUseCase } from "@/application/interfaces/use-cases/IGetIssuesByProjectUseCase";

export class IssueController {
  constructor(
    private readonly _createIssueUseCase: ICreateIssueUseCase,
    private readonly _getIssuesByProjectUseCase: IGetIssuesByProjectUseCase
  ) {}

  createIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;

    const validatedData = CreateIssueSchema.parse(req.body) as CreateIssueDto;

    const workspaceId = validatedData.workspaceId || user.currentWorkspaceId;

    if (!workspaceId) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const result = await this._createIssueUseCase.execute({
      ...validatedData,
      workspaceId,
    });

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.ISSUE_CREATED_SUCCESS, result));
  });

  getIssuesByProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        "Project ID is required",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const issues = await this._getIssuesByProjectUseCase.execute(projectId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Issues retrieved successfully", issues));
  });
}
