import { CreateSprintDto, AssignIssueToSprintDto, StartSprintDto, CompleteSprintDto } from "@/application/dtos/SprintDto";
import { ICreateSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICreateSprintUseCase";
import { IGetSprintsByProjectUseCase } from "@/application/interfaces/use-cases/Sprint/IGetSprintsByProjectUseCase";
import { IAssignIssueToSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IAssignIssueToSprintUseCase";
import { IStartSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IStartSprintUseCase";
import { IGetActiveSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IGetActiveSprintUseCase";
import { ICompleteSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICompleteSprintUseCase";
import { IUpdateSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IUpdateSprintUseCase";
import { IGetSprintBurndownUseCase } from "@/application/interfaces/use-cases/Sprint/IGetSprintBurndownUseCase";
import { IGetSprintAllocationUseCase } from "@/application/interfaces/use-cases/Sprint/IGetSprintAllocationUseCase";
import { GetSprintHistoryDetailsUseCase } from "@/application/use-cases/Sprint/GetSprintHistoryDetailsUseCase";

import { asyncHandler } from "../utils/AsyncHandler";
import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { CreateSprintSchema } from "@/shared/schema/sprint/CreateSprintSchema";
import { AssignIssueToSprintSchema } from "@/shared/schema/sprint/AssignIssueToSprintSchema";
import { StartSprintSchema } from "@/shared/schema/sprint/StartSprintSchema";
import { CompleteSprintSchema } from "@/shared/schema/sprint/CompleteSprintSchema";
import { UpdateSprintSchema } from "@/shared/schema/sprint/UpdateSprintSchema";
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
    private readonly _startSprintUseCase: IStartSprintUseCase,
    private readonly _getActiveSprintUseCase: IGetActiveSprintUseCase,
    private readonly _completeSprintUseCase: ICompleteSprintUseCase,
    private readonly _updateSprintUseCase: IUpdateSprintUseCase,
    private readonly _getSprintBurndownUseCase: IGetSprintBurndownUseCase,
    private readonly _getSprintAllocationUseCase: IGetSprintAllocationUseCase,
    private readonly _getSprintHistoryDetailsUseCase: GetSprintHistoryDetailsUseCase,
  ) { }


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
    const projectId = req.params.projectId as string;
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

  startSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = StartSprintSchema.parse(req.body) as StartSprintDto;

      validatedData.sprintId = req.params.sprintId as string;

    const result = await this._startSprintUseCase.execute(
      userId,
      validatedData,
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.SPRINT_STARTED_SUCCESS, result));
  });

  getActiveSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = req.params.projectId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getActiveSprintUseCase.execute(
      userId,
      projectId,
    );

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.ACTIVE_SPRINT_RETRIEVED_SUCCESS, result),
      );
  });

  completeSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sprintId = req.params.sprintId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = CompleteSprintSchema.parse(req.body);

    const payload: CompleteSprintDto = {
        sprintId,
        moveToSprintId: validatedData.moveToSprintId
    };

    const result = await this._completeSprintUseCase.execute(
      userId,
      payload,
    );

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.SPRINT_COMPLETED_SUCCESS, result),
      );
  });

  updateSprint = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sprintId = req.params.sprintId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = UpdateSprintSchema.parse({
      ...req.body,
      sprintId,
    });
    
    const result = await this._updateSprintUseCase.execute(userId, validatedData);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.SPRINT_UPDATED_SUCCESS, result));
  });
  
  getBurndown = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sprintId = req.params.sprintId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getSprintBurndownUseCase.execute(sprintId);

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success("Burndown data retrieved successfully", result),
      );
  });

  getSprintAllocation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sprintId = req.params.sprintId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getSprintAllocationUseCase.execute(sprintId);

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success("Sprint allocation retrieved successfully", result),
      );
  });

  getSprintHistoryDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const sprintId = req.params.sprintId as string;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const result = await this._getSprintHistoryDetailsUseCase.execute(sprintId);

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.SPRINT_HISTORY_RETRIEVED_SUCCESS, result),
      );
  });
}

