import { IssuePriority, IssueStatus } from "@/domain/entities/Issue";

export interface RecentIssueDto {
  issueId: string;
  issueKey: string;
  title: string;
  priority: IssuePriority;
  assigneeName: string | null;
  assigneeInitials: string | null;
  status: IssueStatus;
}

export interface ProjectOverviewDto {
  openIssuesCount: number;
  teamMembersCount: number;
  recentIssues: RecentIssueDto[];
}

export interface IGetProjectOverviewUseCase {
  execute(userId: string, projectId: string): Promise<ProjectOverviewDto>;
}
