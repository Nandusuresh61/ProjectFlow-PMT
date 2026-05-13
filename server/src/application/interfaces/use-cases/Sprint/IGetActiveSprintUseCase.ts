import { Sprint } from "@/domain/entities/Sprint";
import { Issue } from "@/domain/entities/Issue";

export interface IGetActiveSprintUseCaseResponse {
  sprint: Sprint | null;
  issues: Issue[];
}

export interface IGetActiveSprintUseCase {
  execute(userId: string, projectId: string): Promise<IGetActiveSprintUseCaseResponse>;
}
