import { Issue } from "@/domain/entities/Issue";

export interface IGetIssuesByProjectUseCase {
  execute(
    userId: string,
    projectId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{ issues: Issue[]; total: number }>;
}
