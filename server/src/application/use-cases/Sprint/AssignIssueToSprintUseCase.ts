import { AssignIssueToSprintDto } from "@/application/dtos/SprintDto";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IAssignIssueToSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IAssignIssueToSprintUseCase";
import { Issue } from "@/domain/entities/Issue";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { ISprintAllocationCalculatorService } from "@/application/interfaces/services/ISprintAllocationCalculatorService";
import { IWorkspaceEventTrackingService } from "@/application/interfaces/services/IWorkspaceEventTrackingService";

export class AssignIssueToSprintUseCase implements IAssignIssueToSprintUseCase {
  constructor(
    private readonly _issueRepo: IIssueRepository,
    private readonly _sprintRepo: ISprintRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _allocationCalculatorService: ISprintAllocationCalculatorService,
    private readonly _eventTracker: IWorkspaceEventTrackingService
  ) { }

  async execute(userId: string, data: AssignIssueToSprintDto): Promise<Issue> {
    const { issueId, sprintId } = data;

    const issue = await this._issueRepo.findById(issueId);
    if (!issue) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.ISSUE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const oldSprintId = issue.sprintId;

    const project = await this._projectRepo.findById(issue.projectId);
    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      issue.workspaceId,
    );

    if (!membership) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    const isRestrictedRole =
      membership.role === WorkspaceRoleEnum.WORKSPACE_MEMBER ||
      membership.role === WorkspaceRoleEnum.WORKSPACE_VIEWER;

    if (isRestrictedRole && !project.memberIds.includes(userId)) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (membership.role === WorkspaceRoleEnum.WORKSPACE_VIEWER) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (sprintId) {
      const sprint = await this._sprintRepo.findById(sprintId);
      if (!sprint) {
        throw new AppError(
          ErrorCode.RESOURCE_NOT_FOUND,
          AppMessages.TARGET_SPRINT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }
      if (sprint.projectId !== issue.projectId) {
        throw new AppError(
          ErrorCode.INVALID_OPERATION,
          AppMessages.SPRINT_NOT_BELONG_TO_PROJECT,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }


    if (oldSprintId && oldSprintId !== sprintId) {
      const oldSprint = await this._sprintRepo.findById(oldSprintId);
      if (oldSprint) {
        const updatedIssueIds = oldSprint.issueIds.filter(id => id !== issueId);
        await this._sprintRepo.update(oldSprintId, { issueIds: updatedIssueIds });
      }
    }

    if (sprintId && oldSprintId !== sprintId) {
      const newSprint = await this._sprintRepo.findById(sprintId);
      if (newSprint) {
        if (!newSprint.issueIds.includes(issueId)) {
          const updatedIssueIds = [...newSprint.issueIds, issueId];
          await this._sprintRepo.update(sprintId, { issueIds: updatedIssueIds });
        }
      }
    }

    const newStatus = sprintId ? "TODO" : "BACKLOG";

    const updatedIssue = await this._issueRepo.update(issueId, {
      sprintId,
      status: newStatus,
    });

    if (!updatedIssue) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.ISSUE_UPDATE_FAILED,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (updatedIssue.type === 'STORY') {
      const { issues: childTasks } = await this._issueRepo.findByProjectId(
        updatedIssue.projectId,
        1,
        1000,
        undefined,
        undefined,
        updatedIssue.issueId
      );

      for (const task of childTasks) {
        await this._issueRepo.update(task.issueId, {
          sprintId,
          status: newStatus,
        });

        if (oldSprintId && oldSprintId !== sprintId) {
          const oldSprint = await this._sprintRepo.findById(oldSprintId);
          if (oldSprint) {
            const updatedIssueIds = oldSprint.issueIds.filter(id => id !== task.issueId);
            await this._sprintRepo.update(oldSprintId, { issueIds: updatedIssueIds });
          }
        }

        if (sprintId && oldSprintId !== sprintId) {
          const newSprint = await this._sprintRepo.findById(sprintId);
          if (newSprint) {
            if (!newSprint.issueIds.includes(task.issueId)) {
              const updatedIssueIds = [...newSprint.issueIds, task.issueId];
              await this._sprintRepo.update(sprintId, { issueIds: updatedIssueIds });
            }
          }
        }
      }
    }

    if (sprintId) {
      await this._allocationCalculatorService.calculateAndSaveAllocation(sprintId);
    }
    if (oldSprintId && oldSprintId !== sprintId) {
      await this._allocationCalculatorService.calculateAndSaveAllocation(oldSprintId);
    }

    await this._eventTracker.trackEvent({
      workspaceId: updatedIssue.workspaceId,
      actorId: userId,
      eventType: "ISSUE_MOVED",
      entityType: "ISSUE",
      entityId: updatedIssue.issueId,
      projectId: updatedIssue.projectId,
      metadata: {
        issueKey: updatedIssue.issueKey,
        title: updatedIssue.title,
        toSprintId: sprintId,
        fromSprintId: oldSprintId,
      },
    });

    return updatedIssue;
  }
}
