import { UpdateProjectDto } from "@/application/dtos/ProjectDto";
import { Project } from "@/domain/entities/Project";

export interface IUpdateProjectUseCase {
  execute(userId: string, projectId: string, data: UpdateProjectDto): Promise<Project>;
}
