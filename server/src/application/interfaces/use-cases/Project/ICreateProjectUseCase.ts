import { CreateProjectDto } from "@/application/dtos/ProjectDto";
import { Project } from "@/domain/entities/Project";

export interface ICreateProjectUseCase {
  execute(userId: string, data: CreateProjectDto): Promise<Project>;
}
