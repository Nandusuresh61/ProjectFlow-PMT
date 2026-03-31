import { CreateIssueDto } from "@/application/dtos/IssueDto";
import { Issue } from "@/domain/entities/Issue";

export interface ICreateIssueUseCase {
  execute(data: CreateIssueDto): Promise<Issue>;
}