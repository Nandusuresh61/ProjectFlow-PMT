import { Issue } from "@/domain/entities/Issue";

export interface IGetIssuesByProjectUseCase {
  execute(projectId: string): Promise<Issue[]>;
}
