import { IUpdateWorkLogUseCase, UpdateWorkLogDto } from "@/application/interfaces/use-cases/WorkLog/IUpdateWorkLogUseCase";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { WorkLog } from "@/domain/entities/WorkLog";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ISprintBurndownSnapshotService } from "@/application/interfaces/services/ISprintBurndownSnapshotService";


export class UpdateWorkLogUseCase implements IUpdateWorkLogUseCase {
  constructor(
    private readonly _workLogRepository: IWorkLogRepository,
    private readonly _issueRepository: IIssueRepository,
    private readonly _burndownSnapshotService: ISprintBurndownSnapshotService
  ) {}


  async execute(userId: string, workLogId: string, data: UpdateWorkLogDto): Promise<WorkLog> {
    const workLog = await this._workLogRepository.findById(workLogId);
    if (!workLog) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.WORKLOG_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (workLog.userId !== userId) {
      throw new AppError(ErrorCode.AUTH, AppMessages.UNAUTHORIZED_ACCESS, HttpStatusCode.FORBIDDEN);
    }

    const updatedWorkLog = await this._workLogRepository.update(workLogId, data);
    if (!updatedWorkLog) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, AppMessages.INTERNAL_SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    // Recalculate remaining hours
    const issue = await this._issueRepository.findById(workLog.issueId);
    if (issue && issue.estimatedHours !== null) {
      const totalLogged = await this._workLogRepository.getTotalLoggedHours(workLog.issueId);
      const remaining = Math.max(0, issue.estimatedHours - totalLogged);
      await this._issueRepository.update(workLog.issueId, { remainingHours: remaining });
      
      if (issue.sprintId) {
        await this._burndownSnapshotService.captureSnapshot(issue.sprintId);
      }
    }

    return updatedWorkLog;

  }
}
