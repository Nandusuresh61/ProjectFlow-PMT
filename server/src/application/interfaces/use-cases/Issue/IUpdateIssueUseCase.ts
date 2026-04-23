import { UpdateIssueDto } from "@/application/dtos/IssueDto";
import { Issue } from "@/domain/entities/Issue";

export interface IUpdateIssueUseCase {
  execute(userId: string, issueId: string, data: UpdateIssueDto): Promise<Issue>;
}
