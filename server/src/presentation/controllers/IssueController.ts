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

export class IssueController {
  constructor(private readonly _createIssueUseCase: ICreateIssueUseCase) {}

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
}
