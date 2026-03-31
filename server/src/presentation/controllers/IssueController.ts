import { ICreateIssueUseCase } from "@/application/interfaces/use-cases/ICreateIssueUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";

export class IssueController {
    constructor(private readonly _createissueUseCase: ICreateIssueUseCase){}

    createIssue = asyncHandler(async(req:AuthRequest, res:Response) => {
        
        const user = req.user!;
        const workspaceId = req.body.workspaceId || user.currentWorkspaceId;
        
        if (!workspaceId) {
            throw new Error("Workspace ID is required");
        }

        const result = await this._createissueUseCase.execute({
            ...req.body,
            workspaceId
        });

        res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.ISSUE_CREATED_SUCCESS,result))
    })
}