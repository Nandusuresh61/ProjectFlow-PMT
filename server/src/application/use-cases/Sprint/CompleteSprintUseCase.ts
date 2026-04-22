import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { ICompleteSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICompleteSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class CompleteSprintUseCase implements ICompleteSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
  ) { }

  async execute(userId: string, sprintId: string): Promise<Sprint> {
    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (sprint.status !== "ACTIVE") {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_NOT_ACTIVE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const issues = await this._issueRepo.findBySprintId(sprintId);

    const completedPoints = issues
      .filter(issue => issue.status === "DONE")
      .reduce((total, issue) => total + (issue.storyPoints || 0), 0);

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "COMPLETED",
      completedPoints: completedPoints,
    });

    if (!updatedSprint) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedSprint;
  }
}
