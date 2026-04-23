import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IGetProjectOverviewUseCase, ProjectOverviewDto, RecentIssueDto } from "@/application/interfaces/use-cases/Project/IGetProjectOverviewUseCase";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetProjectOverviewUseCase implements IGetProjectOverviewUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(userId: string, projectId: string): Promise<ProjectOverviewDto> {
    const project = await this._projectRepo.findById(projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // Verify user has access to the project
    const membership = await this._membershipRepo.findByUserAndWorkspace(userId, project.workspaceId);
    const isOwnerOrAdmin = membership && ["OWNER", "WORKSPACE_ADMIN"].includes(membership.role);
    const isMember = project.memberIds.includes(userId);

    if (!isOwnerOrAdmin && !isMember) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    // 1. Open Issues Count (Everything except DONE)
    const openIssuesCount = await this._issueRepo.countByProjectIdAndStatus(projectId, [
      "BACKLOG",
      "TODO",
      "IN_PROGRESS",
      "REVIEW",
    ]);

    // 2. Team Members Count
    const teamMembersCount = project.memberIds.length;

    // 3. Recent Issues
    const recentIssuesRaw = await this._issueRepo.findRecentByProjectId(projectId, 5);
    
    // Fetch user details for assignees to get names/initials
    const assigneeIds = [...new Set(recentIssuesRaw.map(i => i.assigneeId).filter(id => id !== null))] as string[];
    const assignees = await this._userRepo.findByIds(assigneeIds);
    const assigneeMap = new Map(assignees.map(u => [u.userId, u]));

    const recentIssues: RecentIssueDto[] = recentIssuesRaw.map(issue => {
      const assignee = issue.assigneeId ? assigneeMap.get(issue.assigneeId) : null;
      return {
        issueId: issue.issueId,
        issueKey: issue.issueKey,
        title: issue.title,
        priority: issue.priority,
        assigneeName: assignee ? assignee.fullName : null,
        assigneeInitials: assignee ? this.getInitials(assignee.fullName) : null,
        status: issue.status,
      };
    });

    return {
      openIssuesCount,
      teamMembersCount,
      recentIssues,
    };
  }

  private getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
}
