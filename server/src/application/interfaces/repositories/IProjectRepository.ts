import { Project } from "@/domain/entities/Project";

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  countByWorkspaceId(workspaceId: string): Promise<number>;
  findByWorkspaceId(workspaceId: string): Promise<Project[]>;
  findById(projectId: string): Promise<Project | null>;
  incrementIssueSequence(projectId: string): Promise<number>;
  findByNameAndWorkspace(
    name: string,
    workspaceId: string
  ): Promise<Project | null>;
  findByKeyAndWorkspace(
    key: string,
    workspaceId: string
  ): Promise<Project | null>;
  update(project: Project): Promise<Project>;
}
