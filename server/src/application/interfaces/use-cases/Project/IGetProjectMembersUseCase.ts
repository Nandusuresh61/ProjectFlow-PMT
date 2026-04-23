import { ProjectMemberDto } from "@/application/dtos/ProjectMemberDto";

export interface IGetProjectMembersUseCase {
  execute(userId: string, projectId: string): Promise<ProjectMemberDto[]>;
}
