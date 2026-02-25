import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ResponseHandler, AppMessages } from "shared";
import { IGetWorkspaceMembersUseCase } from "@/application/interfaces/use-cases/workspace/IGetWorkspaceMembersUseCase";

export class WorkspaceController {
  constructor(private readonly _getMembersUseCase: IGetWorkspaceMembersUseCase) {}

  getMembers = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    const members = await this._getMembersUseCase.execute(workspaceId);
    console.log(members)

    res
      .status(200)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, members));
  });
}
