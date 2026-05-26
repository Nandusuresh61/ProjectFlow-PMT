import { Request, Response } from "express";
import { IAddWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IAddWorkLogUseCase";
import { IUpdateWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IUpdateWorkLogUseCase";
import { IDeleteWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IDeleteWorkLogUseCase";
import { IGetIssueWorkLogsUseCase } from "@/application/interfaces/use-cases/WorkLog/IGetIssueWorkLogsUseCase";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

import { AppMessages } from "@/shared/messages/AppMessages";
import { AuthRequest } from "../middlewares/AuthMiddleware";

export class WorkLogController {
  constructor(
    private readonly _addWorkLogUseCase: IAddWorkLogUseCase,
    private readonly _updateWorkLogUseCase: IUpdateWorkLogUseCase,
    private readonly _deleteWorkLogUseCase: IDeleteWorkLogUseCase,
    private readonly _getIssueWorkLogsUseCase: IGetIssueWorkLogsUseCase
  ) { }

  addWorkLog = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const issueId = req.params.issueId as string;
    const workLog = await this._addWorkLogUseCase.execute(userId, issueId, req.body);
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: AppMessages.WORKLOG_ADDED_SUCCESS,
      data: workLog,
    });
  };

  updateWorkLog = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const workLogId = req.params.workLogId as string;
    const workLog = await this._updateWorkLogUseCase.execute(userId, workLogId, req.body);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: AppMessages.WORKLOG_UPDATED_SUCCESS,
      data: workLog,
    });
  };

  deleteWorkLog = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const workLogId = req.params.workLogId as string;
    await this._deleteWorkLogUseCase.execute(userId, workLogId);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: AppMessages.WORKLOG_DELETED_SUCCESS,
    });
  };

  getIssueWorkLogs = async (req: Request, res: Response) => {
    const issueId = req.params.issueId as string;
    const workLogs = await this._getIssueWorkLogsUseCase.execute(issueId);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: AppMessages.WORKLOGS_RETRIEVED_SUCCESS,
      data: workLogs,
    });
  };
}
