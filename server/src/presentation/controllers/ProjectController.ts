import { CreateProjectDto, UpdateProjectDto } from "@/application/dtos/ProjectDto";
import { ICreateProjectUseCase } from "@/application/interfaces/use-cases/Project/ICreateProjectUseCase";
import { IGetWorkspaceProjectsUseCase } from "@/application/interfaces/use-cases/Project/IGetWorkspaceProjectsUseCase";
import { IGetProjectMembersUseCase } from "@/application/interfaces/use-cases/Project/IGetProjectMembersUseCase";
import { IGetProjectOverviewUseCase } from "@/application/interfaces/use-cases/Project/IGetProjectOverviewUseCase";
import { IUpdateProjectUseCase } from "@/application/interfaces/use-cases/Project/IUpdateProjectUseCase";
import { CreateProjectSchema } from "@/shared/schema/project/CreateProjectSchema";
import { UpdateProjectSchema } from "@/shared/schema/project/UpdateProjectSchema";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { Response } from "express";

export class ProjectController {
  constructor(
    private readonly _createProjectUseCase: ICreateProjectUseCase,
    private readonly _getWorkspaceProjectsUseCase: IGetWorkspaceProjectsUseCase,
    private readonly _updateProjectUseCase: IUpdateProjectUseCase,
    private readonly _getProjectMembersUseCase: IGetProjectMembersUseCase,
    private readonly _getProjectOverviewUseCase: IGetProjectOverviewUseCase
  ) {}

  getProjectMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const projectId = req.params.projectId as string;

    const result = await this._getProjectMembersUseCase.execute(
      tokenPayload.userId,
      projectId
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const validatedData = CreateProjectSchema.parse(req.body) as CreateProjectDto;

    const result = await this._createProjectUseCase.execute(
      tokenPayload.userId,
      validatedData
    );

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.PROJECT_CREATED, result));
  });

  getWorkspaceProjects = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const tokenPayload = req.user!;
      const workspaceId = req.params.workspaceId as string;

      const result = await this._getWorkspaceProjectsUseCase.execute(
        tokenPayload.userId,
        workspaceId
      );

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
    }
  );

  updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const projectId = req.params.projectId as string;
    const validatedData = UpdateProjectSchema.parse(req.body) as UpdateProjectDto;

    const result = await this._updateProjectUseCase.execute(
      tokenPayload.userId,
      projectId,
      validatedData
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.PROJECT_UPDATED, result));
  });

  getProjectOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const projectId = req.params.projectId as string;

    const result = await this._getProjectOverviewUseCase.execute(
      tokenPayload.userId,
      projectId
    );

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });
}
