import { IAddWorkLogUseCase, AddWorkLogDto } from "@/application/interfaces/use-cases/WorkLog/IAddWorkLogUseCase";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { WorkLog } from "@/domain/entities/WorkLog";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";

export class AddWorkLogUseCase implements IAddWorkLogUseCase {
  constructor(
    private readonly _workLogRepository: IWorkLogRepository,
    private readonly _issueRepository: IIssueRepository,
    private readonly _uidService: IUidGenerator
  ) {}

  async execute(userId: string, issueId: string, data: AddWorkLogDto): Promise<WorkLog> {
    const issue = await this._issueRepository.findById(issueId);
    if (!issue) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.ISSUE_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (issue.type === "STORY") {
      throw new AppError(ErrorCode.VALIDATION, "Time tracking is not available for Story", HttpStatusCode.BAD_REQUEST);
    }

    const workLogId = this._uidService.createId();
    const workLog = new WorkLog(
      workLogId,
      issueId,
      userId,
      data.hours,
      data.note || null,
      new Date(),
      new Date()
    );

    const createdWorkLog = await this._workLogRepository.create(workLog);

    // Recalculate remaining hours
    const totalLogged = await this._workLogRepository.getTotalLoggedHours(issueId);
    
    if (issue.estimatedHours !== null) {
      const remaining = Math.max(0, issue.estimatedHours - totalLogged);
      await this._issueRepository.update(issueId, { remainingHours: remaining });
    }

    return createdWorkLog;
  }
}
