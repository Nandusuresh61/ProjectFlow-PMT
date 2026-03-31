import { IUpdateIssueUseCase } from "@/application/interfaces/use-cases/IUpdateIssueUseCase";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { UpdateIssueDto } from "@/application/dtos/IssueDto";
import { Issue } from "@/domain/entities/Issue";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class UpdateIssueUseCase implements IUpdateIssueUseCase {
  constructor(private readonly issueRepository: IIssueRepository) {}

  async execute(issueId: string, data: UpdateIssueDto): Promise<Issue> {
    const updatedIssue = await this.issueRepository.update(issueId, data as Partial<Issue>);
    
    if (!updatedIssue) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        "Issue not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    
    return updatedIssue;
  }
}
