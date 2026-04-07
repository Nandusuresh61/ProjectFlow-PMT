import { ICreateIssueUseCase } from "@/application/interfaces/use-cases/Issue/ICreateIssueUseCase";
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

import { IGetIssuesByProjectUseCase } from "@/application/interfaces/use-cases/Issue/IGetIssuesByProjectUseCase";
import { IUpdateIssueUseCase } from "@/application/interfaces/use-cases/Issue/IUpdateIssueUseCase";
import { UpdateIssueSchema } from "@/shared/schema/issue/UpdateIssueSchema";

export class IssueController {
  constructor(
    private readonly _createIssueUseCase: ICreateIssueUseCase,
    private readonly _getIssuesByProjectUseCase: IGetIssuesByProjectUseCase,
    private readonly _updateIssueUseCase: IUpdateIssueUseCase
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

    const result = await this._createIssueUseCase.execute(user.userId, {
      ...validatedData,
      workspaceId,
    });

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.ISSUE_CREATED_SUCCESS, result));
  });

  getIssuesByProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { projectId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";

    if (!projectId) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        "Project ID is required",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const { issues, total } = await this._getIssuesByProjectUseCase.execute(
      user.userId,
      projectId,
      page,
      limit,
      search
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Issues retrieved successfully", { issues, total }));
  });

  updateIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { issueId } = req.params;

    if (!issueId) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        "Issue ID is required",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const result = UpdateIssueSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        "Invalid issue data: " + result.error.issues.map(e => e.message).join(", "),
        HttpStatusCode.BAD_REQUEST
      );
    }

    const updatedIssue = await this._updateIssueUseCase.execute(
      user.userId,
      issueId,
      result.data as any
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success("Issue updated successfully", updatedIssue));
  });
}
