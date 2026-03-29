import { Project } from "@/domain/entities/Project";

export interface IGetWorkspaceProjectsUseCase {
  execute(userId: string, workspaceId: string): Promise<Project[]>;
}
