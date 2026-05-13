import { Issue } from "@/domain/entities/Issue";

export interface IGetIssuesByProjectUseCase {
  execute(
    userId: string,
    projectId: string,
    page: number,
    limit: number,
    search?: string,
    type?: string,
    parentId?: string | null
  ): Promise<{ issues: Issue[]; total: number }>;
}
