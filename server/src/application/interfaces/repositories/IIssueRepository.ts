import { Issue } from "@/domain/entities/Issue";

export interface IIssueRepository {
  create(issue: Issue): Promise<Issue>;
  findByProjectId(projectId: string, page: number, limit: number, search?: string): Promise<{ issues: Issue[], total: number }>;
  findById(issueId: string): Promise<Issue | null>;
  update(issueId: string, data: Partial<Issue>): Promise<Issue | null>;
  findBySprintId(sprintId: string): Promise<Issue[]>;
  countActiveByAssigneeAndProject(assigneeId: string, projectId: string): Promise<number>;
  countByProjectIdAndStatus(projectId: string, statuses: string[]): Promise<number>;
  findRecentByProjectId(projectId: string, limit: number): Promise<Issue[]>;
  countByWorkspaceId(workspaceId: string): Promise<number>;
  countByWorkspaceIdAndAssignee(workspaceId: string, assigneeId: string): Promise<number>;
  findRecentByWorkspaceId(workspaceId: string, limit: number): Promise<Issue[]>;
  findRecentByWorkspaceIdAndAssignee(workspaceId: string, assigneeId: string, limit: number): Promise<Issue[]>;
}
