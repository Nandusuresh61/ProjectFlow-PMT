import { ProjectVelocityDto } from "@/application/dtos/SprintAnalyticsDto";

export interface IGetProjectVelocityUseCase {
  execute(userId: string, projectId: string): Promise<ProjectVelocityDto>;
}
