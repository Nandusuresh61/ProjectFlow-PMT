import { Response, NextFunction } from "express";
import { AppError, ErrorCode, HttpStatusCode, AppMessages } from "shared";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceRoleEnum } from "shared";
import { AuthRequest } from "./AuthMiddleware";

export class WorkspaceRoleMiddleware {
  constructor(
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _workspaceRepo: IWorkspaceRepository
  ) {}

  requireRoles(allowedRoles: WorkspaceRoleEnum[]) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const userId = req.user?.userId;
        const { workspaceId } = req.params;

        if (!userId) {
          throw new AppError(
            ErrorCode.AUTH,
            AppMessages.UNAUTHORIZED_ACCESS,
            HttpStatusCode.UNAUTHORIZED
          );
        }

        const workspace = await this._workspaceRepo.findById(workspaceId);

        if (!workspace) {
          throw new AppError(
            ErrorCode.RESOURCE_NOT_FOUND,
            AppMessages.WORKSPACE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
          );
        }

        if (workspace.ownerId === userId) {
          return next();
        }

        const membership =
          await this._membershipRepo.findByUserAndWorkspace(
            userId,
            workspaceId
          );

        if (!membership) {
          throw new AppError(
            ErrorCode.AUTH,
            AppMessages.UNAUTHORIZED_ACCESS,
            HttpStatusCode.FORBIDDEN
          );
        }

        if (!allowedRoles.includes(membership.role)) {
          throw new AppError(
            ErrorCode.AUTH,
            AppMessages.UNAUTHORIZED_ACCESS,
            HttpStatusCode.FORBIDDEN
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}