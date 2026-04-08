import { CreateSprintDto, AssignIssueToSprintDto } from "@/application/dtos/SprintDto";
import { ICreateSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICreateSprintUseCase";
import { IGetSprintsByProjectUseCase } from "@/application/interfaces/use-cases/Sprint/IGetSprintsByProjectUseCase";
import { IAssignIssueToSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IAssignIssueToSprintUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { CreateSprintSchema } from "@/shared/schema/sprint/CreateSprintSchema";
import { AssignIssueToSprintSchema } from "@/shared/schema/sprint/AssignIssueToSprintSchema";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";

import { ErrorCode } from "@/shared/enums/ErrorCode";
import { AppError } from "@/shared/errors/AppError";

export class SprintController {
  constructor(
    private readonly _createSprintUseCase: ICreateSprintUseCase,
    private readonly _getSprintsByProjectUseCase: IGetSprintsByProjectUseCase,
    private readonly _assignIssueToSprintUseCase: IAssignIssueToSprintUseCase,
  ) {}

  createSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const validatedData = CreateSprintSchema.parse(req.body) as CreateSprintDto;

    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._createSprintUseCase.execute(
      userId,
      validatedData,
    );

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.SPRINT_CREATED_SUCCESS, result));
  });

  getSprintsByProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const sprints = await this._getSprintsByProjectUseCase.execute(
      userId,
      projectId,
    );

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.SPRINTS_RETRIEVED_SUCCESS, sprints),
      );
  });

  assignIssueToSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = AssignIssueToSprintSchema.parse(req.body) as AssignIssueToSprintDto;

    const result = await this._assignIssueToSprintUseCase.execute(
      userId,
      validatedData,
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.ISSUE_ASSIGNED_TO_SPRINT_SUCCESS, result));
  });
}
