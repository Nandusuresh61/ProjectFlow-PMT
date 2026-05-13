import { IGetIssueWorkLogsUseCase } from "@/application/interfaces/use-cases/WorkLog/IGetIssueWorkLogsUseCase";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { WorkLog } from "@/domain/entities/WorkLog";

export class GetIssueWorkLogsUseCase implements IGetIssueWorkLogsUseCase {
  constructor(private readonly _workLogRepository: IWorkLogRepository) {}

  async execute(issueId: string): Promise<WorkLog[]> {
    return this._workLogRepository.findByIssueId(issueId);
  }
}
