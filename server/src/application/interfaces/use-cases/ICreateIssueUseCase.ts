import { CreateIssueDto } from "@/application/dtos/IssueDto";
import { Issue } from "@/domain/entities/Issue";

export interface ICreateIssueUseCase {
  execute(userId: string, data: CreateIssueDto): Promise<Issue>;
}