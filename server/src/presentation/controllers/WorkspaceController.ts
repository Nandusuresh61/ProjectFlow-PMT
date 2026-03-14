import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ResponseHandler, AppMessages, HttpStatusCode } from "shared";
import { IGetWorkspaceMembersUseCase } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceMembersUseCase";
import { IGetUserWorkspacesUseCase } from "@/application/interfaces/use-cases/workspace/IGetUserWorkspacesUseCase";
import { ISwitchWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ISwitchWorkspaceUseCase";
import { ICreateWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ICreateWorkspaceUseCase";

export class WorkspaceController {
  constructor(
    private readonly _getMembersUseCase: IGetWorkspaceMembersUseCase,
    private readonly _getUserWorkspacesUseCase: IGetUserWorkspacesUseCase,
    private readonly _switchWorkspaceUseCase: ISwitchWorkspaceUseCase,
    private readonly _createWorkspaceUseCase: ICreateWorkspaceUseCase
  ) {}

  getMembers = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const members = await this._getMembersUseCase.execute(workspaceId);
    console.log(members)

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, members));
  });

  getUserWorkspaces = asyncHandler(async (req: Request, res: Response) => {
    const tokenPayload = (req as any).user;
    
    const workspaces = await this._getUserWorkspacesUseCase.execute(tokenPayload.userId);
    
    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, workspaces));
  });

  switchWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const tokenPayload = (req as any).user;
    const { workspaceId } = req.params;

    const result = await this._switchWorkspaceUseCase.execute(tokenPayload.userId, workspaceId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(result.message));
  });

  createWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const tokenPayload = (req as any).user;
    const { workspaceName, planId } = req.body;

    const result = await this._createWorkspaceUseCase.execute(tokenPayload.userId, workspaceName, planId);

    res.status(HttpStatusCode.CREATED).json(ResponseHandler.success("Workspace created successfully", result));
  });
}
