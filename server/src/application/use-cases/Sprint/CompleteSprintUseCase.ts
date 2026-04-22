import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { ICompleteSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICompleteSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { CompleteSprintDto } from "@/application/dtos/SprintDto";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class CompleteSprintUseCase implements ICompleteSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
  ) { }

  async execute(userId: string, data: CompleteSprintDto): Promise<Sprint> {
    const { sprintId, moveToSprintId } = data;

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

    const incompleteIssues = issues.filter(issue => issue.status !== "DONE");
    const completedPoints = issues
      .filter(issue => issue.status === "DONE")
      .reduce((total, issue) => total + (issue.storyPoints || 0), 0);

    for (const issue of incompleteIssues) {
      const newStatus = moveToSprintId ? "TODO" : "BACKLOG";
      await this._issueRepo.update(issue.issueId, {
        sprintId: moveToSprintId || null,
        status: newStatus,
      });
    }

    if (moveToSprintId) {
      const targetSprint = await this._sprintRepo.findById(moveToSprintId);
      if (targetSprint) {
        const newIssueIds = [...targetSprint.issueIds, ...incompleteIssues.map(i => i.issueId)];
        await this._sprintRepo.update(moveToSprintId, { issueIds: newIssueIds });
      }
    }

    // Update old sprint
    const remainingIssueIds = issues
      .filter(i => i.status === "DONE")
      .map(i => i.issueId);

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "COMPLETED",
      completedPoints: completedPoints,
      issueIds: remainingIssueIds,
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
