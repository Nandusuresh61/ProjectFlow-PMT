import { Project } from "@/domain/entities/Project";

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  countByWorkspaceId(workspaceId: string): Promise<number>;
  findByWorkspaceId(workspaceId: string): Promise<Project[]>;
  findById(projectId: string): Promise<Project | null>;
  update(project: Project): Promise<Project>;
}
