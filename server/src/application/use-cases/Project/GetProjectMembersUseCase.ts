import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IGetProjectMembersUseCase } from "@/application/interfaces/use-cases/Project/IGetProjectMembersUseCase";
import { ProjectMemberDto } from "@/application/dtos/ProjectMemberDto";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetProjectMembersUseCase implements IGetProjectMembersUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _issueRepo: IIssueRepository
  ) {}

  async execute(userId: string, projectId: string): Promise<ProjectMemberDto[]> {
    const project = await this._projectRepo.findById(projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    // Verify user has access to the project
    const isOwnerOrAdmin = await this.checkUserAccess(userId, project.workspaceId);
    const isMember = project.memberIds.includes(userId);

    if (!isOwnerOrAdmin && !isMember) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    const members = await this._userRepo.findByIds(project.memberIds);
    
    const projectMembers: ProjectMemberDto[] = await Promise.all(
      members.map(async (member) => {
        const membership = await this._membershipRepo.findByUserAndWorkspace(
          member.userId,
          project.workspaceId
        );

        const activeTasksCount = await this._issueRepo.countActiveByAssigneeAndProject(
          member.userId,
          projectId
        );

        return {
          userId: member.userId,
          fullName: member.fullName,
          email: member.email,
          profileImage: member.profileImage,
          role: membership ? membership.role : "MEMBER",
          activeTasksCount,
          status: "online", // Defaulting to online
        };
      })
    );

    return projectMembers;
  }

  private async checkUserAccess(userId: string, workspaceId: string): Promise<boolean> {
     const membership = await this._membershipRepo.findByUserAndWorkspace(userId, workspaceId);
     if(!membership) return false;
     return ["OWNER", "WORKSPACE_ADMIN"].includes(membership.role);
  }
}
