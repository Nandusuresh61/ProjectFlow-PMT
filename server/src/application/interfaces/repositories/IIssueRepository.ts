import { Issue } from "@/domain/entities/Issue";

export interface IIssueRepository {
  create(issue: Issue): Promise<Issue>;
  findByProjectId(projectId: string): Promise<Issue[]>;
}
