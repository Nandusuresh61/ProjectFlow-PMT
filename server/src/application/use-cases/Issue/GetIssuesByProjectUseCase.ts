import { IGetIssuesByProjectUseCase } from "@/application/interfaces/use-cases/IGetIssuesByProjectUseCase";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { Issue } from "@/domain/entities/Issue";

export class GetIssuesByProjectUseCase implements IGetIssuesByProjectUseCase {
  constructor(private readonly issueRepository: IIssueRepository) {}

  async execute(projectId: string, page: number, limit: number, search?: string): Promise<{ issues: Issue[], total: number }> {
    return await this.issueRepository.findByProjectId(projectId, page, limit, search);
  }
}
