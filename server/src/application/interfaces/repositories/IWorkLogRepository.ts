import { WorkLog } from "@/domain/entities/WorkLog";

export interface IWorkLogRepository {
  create(workLog: WorkLog): Promise<WorkLog>;
  findById(workLogId: string): Promise<WorkLog | null>;
  findByIssueId(issueId: string): Promise<WorkLog[]>;
  update(workLogId: string, data: Partial<WorkLog>): Promise<WorkLog | null>;
  delete(workLogId: string): Promise<boolean>;
  getTotalLoggedHours(issueId: string): Promise<number>;
}
