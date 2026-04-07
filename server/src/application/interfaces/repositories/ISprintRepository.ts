import { Sprint } from "@/domain/entities/Sprint";

export interface ISprintRepository {
  create(sprint: Sprint): Promise<void>;
  findByProjectId(projectId: string): Promise<Sprint[]>;
}