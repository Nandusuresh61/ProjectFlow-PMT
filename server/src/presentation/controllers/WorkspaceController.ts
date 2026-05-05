import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { asyncHandler } from "../utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { IGetWorkspaceMembersUseCase } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceMembersUseCase";
import { IGetUserWorkspacesUseCase } from "@/application/interfaces/use-cases/workspace/IGetUserWorkspacesUseCase";
import { ISwitchWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ISwitchWorkspaceUseCase";
import { ICreateWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ICreateWorkspaceUseCase";
import { ICheckWorkspaceNameUseCase } from "@/application/interfaces/use-cases/workspace/ICheckWorkspaceNameUseCase";
import { IGetWorkspaceDashboardDataUseCase } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceDashboardDataUseCase";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class WorkspaceController {
  constructor(
    private readonly _getMembersUseCase: IGetWorkspaceMembersUseCase,
    private readonly _getUserWorkspacesUseCase: IGetUserWorkspacesUseCase,
    private readonly _switchWorkspaceUseCase: ISwitchWorkspaceUseCase,
    private readonly _createWorkspaceUseCase: ICreateWorkspaceUseCase,
    private readonly _checkNameUseCase: ICheckWorkspaceNameUseCase,
    private readonly _getDashboardDataUseCase: IGetWorkspaceDashboardDataUseCase,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _workspaceRepo: IWorkspaceRepository
  ) {}

  getMembers = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const search = req.query.search as string || "";

    const members = await this._getMembersUseCase.execute(workspaceId, search);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, members));
  });

  getUserWorkspaces = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    
    const workspaces = await this._getUserWorkspacesUseCase.execute(tokenPayload.userId);
    
    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, workspaces));
  });

  switchWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const { workspaceId } = req.params;

    const result = await this._switchWorkspaceUseCase.execute(tokenPayload.userId, workspaceId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(result.message));
  });

  createWorkspace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;
    const { workspaceName, planId } = req.body;

    const result = await this._createWorkspaceUseCase.execute(tokenPayload.userId, workspaceName, planId);

    res.status(HttpStatusCode.CREATED).json(ResponseHandler.success("Workspace created successfully", result));
  });

  checkNameAvailability = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(AppMessages.VALIDATION_FAILED));
      return;
    }

    const isAvailable = await this._checkNameUseCase.execute(name);

    if (!isAvailable) {
       res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.WORKSPACE_NAME_ALREADY_EXISTS, { isAvailable }));
       return;
    }

    res.status(HttpStatusCode.OK).json(ResponseHandler.success("Workspace name is available", { isAvailable }));
  });

  getDashboardData = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { workspaceId } = req.params;
    const { userId } = req.user!;

    // Determine role
    const workspace = await this._workspaceRepo.findById(workspaceId);
    if (!workspace) {
        res.status(HttpStatusCode.NOT_FOUND).json(ResponseHandler.error("Workspace not found"));
        return;
    }

    let role: WorkspaceRoleEnum;
    if (workspace.ownerId === userId) {
        role = WorkspaceRoleEnum.WORKSPACE_OWNER;
    } else {
        const membership = await this._membershipRepo.findByUserAndWorkspace(userId, workspaceId);
        if (!membership) {
            res.status(HttpStatusCode.FORBIDDEN).json(ResponseHandler.error("You are not a member of this workspace"));
            return;
        }
        role = membership.role;
    }

    const data = await this._getDashboardDataUseCase.execute(workspaceId, userId, role);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, data));
  });
}
