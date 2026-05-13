import { WorkLog } from "@/domain/entities/WorkLog";

export interface IGetIssueWorkLogsUseCase {
  execute(issueId: string): Promise<WorkLog[]>;
}
