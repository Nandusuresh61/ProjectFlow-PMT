import { Request, Response } from "express";
import { IAddWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IAddWorkLogUseCase";
import { IUpdateWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IUpdateWorkLogUseCase";
import { IDeleteWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IDeleteWorkLogUseCase";
import { IGetIssueWorkLogsUseCase } from "@/application/interfaces/use-cases/WorkLog/IGetIssueWorkLogsUseCase";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class WorkLogController {
  constructor(
    private readonly _addWorkLogUseCase: IAddWorkLogUseCase,
    private readonly _updateWorkLogUseCase: IUpdateWorkLogUseCase,
    private readonly _deleteWorkLogUseCase: IDeleteWorkLogUseCase,
    private readonly _getIssueWorkLogsUseCase: IGetIssueWorkLogsUseCase
  ) {}

  addWorkLog = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { issueId } = req.params;
    const workLog = await this._addWorkLogUseCase.execute(userId, issueId, req.body);
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: "Worklog added successfully",
      data: workLog,
    });
  };

  updateWorkLog = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { workLogId } = req.params;
    const workLog = await this._updateWorkLogUseCase.execute(userId, workLogId, req.body);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Worklog updated successfully",
      data: workLog,
    });
  };

  deleteWorkLog = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { workLogId } = req.params;
    await this._deleteWorkLogUseCase.execute(userId, workLogId);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Worklog deleted successfully",
    });
  };

  getIssueWorkLogs = async (req: Request, res: Response) => {
    const { issueId } = req.params;
    const workLogs = await this._getIssueWorkLogsUseCase.execute(issueId);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Worklogs retrieved successfully",
      data: workLogs,
    });
  };
}
