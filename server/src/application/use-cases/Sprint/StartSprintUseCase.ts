import { StartSprintDto } from "@/application/dtos/SprintDto";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IStartSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IStartSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class StartSprintUseCase implements IStartSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
  ) {}

  async execute(userId: string, data: StartSprintDto): Promise<Sprint> {
    const { sprintId, startDate, endDate } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.INVALID_DATE_RANGE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const sprint = await this._sprintRepo.findById(sprintId);
    
    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = await this._projectRepo.findById(sprint.projectId);
    if (!project) {
       throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      project.workspaceId,
    );

    if (
      !membership ||
      (membership.role !== WorkspaceRoleEnum.WORKSPACE_OWNER &&
        membership.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN)
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (sprint.status !== "PLANNED") {
       throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_NOT_PLANNED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const activeSprint = await this._sprintRepo.findActiveProjectId(sprint.projectId);
    
    if (activeSprint) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_ALREADY_ACTIVE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const issues = await this._issueRepo.findBySprintId(sprintId);
    const plannedPoints = issues
      .filter((issue) => issue.type === "STORY" || issue.type === "BUG")
      .reduce((total, issue) => total + (issue.storyPoints || 0), 0);

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "ACTIVE",
      startDate: start,
      endDate: end,
      plannedPoints: plannedPoints,
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
