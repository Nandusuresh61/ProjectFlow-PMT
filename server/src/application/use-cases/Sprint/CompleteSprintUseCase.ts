import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ISprintMetricsCalculatorService } from "@/application/interfaces/services/ISprintMetricsCalculatorService";
import { ICompleteSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICompleteSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { SprintAnalytics } from "@/domain/entities/SprintAnalytics";
import { Issue } from "@/domain/entities/Issue";
import { CompleteSprintDto } from "@/application/dtos/SprintDto";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { ISprintBurndownSnapshotService } from "@/application/interfaces/services/ISprintBurndownSnapshotService";


export class CompleteSprintUseCase implements ICompleteSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
    private readonly _workLogRepo: IWorkLogRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _metricsCalculator: ISprintMetricsCalculatorService,
    private readonly _burndownSnapshotService: ISprintBurndownSnapshotService,
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

    if (sprint.status !== "ACTIVE") {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_NOT_ACTIVE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (moveToSprintId) {
      const targetSprint = await this._sprintRepo.findById(moveToSprintId);
      if (!targetSprint) {
        throw new AppError(
          ErrorCode.RESOURCE_NOT_FOUND,
          AppMessages.TARGET_SPRINT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }

      if (targetSprint.projectId !== sprint.projectId) {
        throw new AppError(
          ErrorCode.INVALID_OPERATION,
          AppMessages.SPRINT_NOT_BELONG_TO_PROJECT,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    const issues = await this._issueRepo.findBySprintId(sprintId);
    const issueIds = issues.map((issue) => issue.issueId);
    const loggedHoursByIssueId = await this._workLogRepo.getTotalLoggedHoursByIssueIds(issueIds);
    const completedAt = new Date();
    const metrics = this._metricsCalculator.aggregateSprintMetrics(
      sprint,
      issues,
      loggedHoursByIssueId,
      completedAt,
    );

    const existingAnalytics = await this._sprintAnalyticsRepo.findBySprintId(sprintId);

    if (!existingAnalytics) {
      await this._sprintAnalyticsRepo.create(
        new SprintAnalytics(
          this._uidGenerator.createId(),
          sprint.sprintId,
          sprint.projectId,
          project.workspaceId,
          metrics.sprintName,
          metrics.sprintGoal,
          metrics.startedAt,
          metrics.completedAt,
          metrics.committedIssues,
          metrics.completedIssues,
          metrics.incompleteIssues,
          metrics.committedStoryPoints,
          metrics.completedStoryPoints,
          metrics.spilloverStoryPoints,
          metrics.committedEstimatedHours,
          metrics.loggedHours,
          metrics.remainingHours,
          metrics.completionRate,
          metrics.velocity,
          metrics.scopeChangeCount,
          completedAt,
        ),
      );
    }

    const issuesToMove: Issue[] = [];
    const issuesToStay: Issue[] = [];
    const movedIssueIds = new Set<string>();

    const stories = issues.filter(i => i.type === "STORY");
    const bugs = issues.filter(i => i.type === "BUG");
    const tasks = issues.filter(i => i.type === "TASK");

    for (const story of stories) {
      const childTasks = tasks.filter(t => t.parentId === story.issueId);
      const doneTasks = childTasks.filter(t => t.status === "DONE");
      const notDoneTasks = childTasks.filter(t => t.status !== "DONE");

      if (doneTasks.length > 0 && notDoneTasks.length > 0) {
        // PARTIAL STORY CONTINUATION
        const sequence = await this._projectRepo.incrementIssueSequence(story.projectId);
        const continuationIssueKey = `${project.projectKey}-${sequence}`;
        const continuationStoryId = this._uidGenerator.createId();

        const continuationStory = new Issue(
          continuationStoryId,
          continuationIssueKey,
          `${story.title} (Continued)`,
          story.description,
          "STORY",
          moveToSprintId ? "TODO" : "BACKLOG",
          story.priority,
          story.sizeLabel,
          story.storyPoints,
          story.assigneeId,
          moveToSprintId || null,
          story.projectId,
          story.workspaceId,
          null, // parentId
          notDoneTasks.map(t => t.issueId), // taskIds
          story.acceptanceCriteria,
          story.attachments,
          null, // estimatedHours
          null, // remainingHours
          story.continuedFromIssueId || story.issueId,
          null, // continuedIssueId
          new Date(),
          new Date()
        );

        // Update original story as historical snapshot
        await this._issueRepo.update(story.issueId, {
          continuedIssueId: continuationStoryId,
          taskIds: doneTasks.map(t => t.issueId),
          status: "DONE"
        });

        // Create continuation story
        await this._issueRepo.create(continuationStory);

        // Move incomplete tasks to new story
        for (const task of notDoneTasks) {
          await this._issueRepo.update(task.issueId, {
            parentId: continuationStoryId,
            sprintId: moveToSprintId || null,
            status: moveToSprintId ? "TODO" : "BACKLOG"
          });
          movedIssueIds.add(task.issueId);
        }

        issuesToMove.push(continuationStory);
        movedIssueIds.add(continuationStoryId);
        
        // Original story stays in the old sprint
        issuesToStay.push(story);
      } else if (doneTasks.length === 0 && childTasks.length > 0) {
        // All tasks incomplete or story itself is incomplete - move whole story
        issuesToMove.push(story);
        movedIssueIds.add(story.issueId);
        for (const task of notDoneTasks) {
          issuesToMove.push(task);
          movedIssueIds.add(task.issueId);
        }
      } else if (childTasks.length === 0 && story.status !== "DONE") {
        // Orphan incomplete story - move
        issuesToMove.push(story);
        movedIssueIds.add(story.issueId);
      } else {
        // Story is fully DONE
        issuesToStay.push(story);
        doneTasks.forEach(t => issuesToStay.push(t));
      }
    }

    // Handle BUGs and Orphan TASKs that weren't moved with a story
    const remainingIssues = [...bugs, ...tasks.filter(t => !t.parentId)];
    for (const issue of remainingIssues) {
      if (movedIssueIds.has(issue.issueId)) continue;

      if (issue.status !== "DONE") {
        issuesToMove.push(issue);
        movedIssueIds.add(issue.issueId);
      } else {
        issuesToStay.push(issue);
      }
    }

    // Update moved issues in DB
    for (const issue of issuesToMove) {
      // If it's a new continuation story, it's already saved with correct sprintId
      const original = issues.find(i => i.issueId === issue.issueId);
      if (!original) continue; 

      const newStatus = moveToSprintId ? "TODO" : "BACKLOG";
      await this._issueRepo.update(issue.issueId, {
        sprintId: moveToSprintId || null,
        status: newStatus as any,
      });
    }

    if (moveToSprintId) {
      const targetSprint = await this._sprintRepo.findById(moveToSprintId);
      if (targetSprint) {
        const newIssueIds = Array.from(new Set([
          ...targetSprint.issueIds,
          ...issuesToMove.map(i => i.issueId),
        ]));
        await this._sprintRepo.update(moveToSprintId, { issueIds: newIssueIds });
      }
    }

    // Update old sprint
    const remainingIssueIds = issuesToStay.map(i => i.issueId);

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "COMPLETED",
      plannedPoints: metrics.committedStoryPoints,
      completedPoints: metrics.completedStoryPoints,
      issueIds: remainingIssueIds,
    });

    if (!updatedSprint) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    // Capture final snapshot for both old and new sprint
    await this._burndownSnapshotService.captureSnapshot(sprintId);
    if (moveToSprintId) {
      await this._burndownSnapshotService.captureSnapshot(moveToSprintId);
    }

    return updatedSprint;

  }
}
