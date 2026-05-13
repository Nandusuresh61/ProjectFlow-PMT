import { IDeleteWorkLogUseCase } from "@/application/interfaces/use-cases/WorkLog/IDeleteWorkLogUseCase";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ISprintBurndownSnapshotService } from "@/application/interfaces/services/ISprintBurndownSnapshotService";
import { ISprintAllocationCalculatorService } from "@/application/interfaces/services/ISprintAllocationCalculatorService";


export class DeleteWorkLogUseCase implements IDeleteWorkLogUseCase {
  constructor(
    private readonly _workLogRepository: IWorkLogRepository,
    private readonly _issueRepository: IIssueRepository,
    private readonly _burndownSnapshotService: ISprintBurndownSnapshotService,
    private readonly _allocationCalculatorService: ISprintAllocationCalculatorService
  ) {}


  async execute(userId: string, workLogId: string): Promise<void> {
    const workLog = await this._workLogRepository.findById(workLogId);
    if (!workLog) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.WORKLOG_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (workLog.userId !== userId) {
      throw new AppError(ErrorCode.AUTH, AppMessages.UNAUTHORIZED_ACCESS, HttpStatusCode.FORBIDDEN);
    }

    const deleted = await this._workLogRepository.delete(workLogId);
    if (!deleted) {
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
        await this._allocationCalculatorService.calculateAndSaveAllocation(issue.sprintId);
      }
    }
  }
}

