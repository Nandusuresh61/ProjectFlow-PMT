import { Issue } from "@/domain/entities/Issue";

export interface IIssueRepository {
  create(issue: Issue): Promise<Issue>;
  findByProjectId(projectId: string, page: number, limit: number, search?: string): Promise<{ issues: Issue[], total: number }>;
  findById(issueId: string): Promise<Issue | null>;
  update(issueId: string, data: Partial<Issue>): Promise<Issue | null>;
  findBySprintId(sprintId: string): Promise<Issue[]>;
  countActiveByAssigneeAndProject(assigneeId: string, projectId: string): Promise<number>;
}
