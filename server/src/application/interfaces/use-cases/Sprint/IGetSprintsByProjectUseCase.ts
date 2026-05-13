import { Sprint } from "@/domain/entities/Sprint";

export interface IGetSprintsByProjectUseCase {
  execute(userId: string, projectId: string): Promise<Sprint[]>;
}
