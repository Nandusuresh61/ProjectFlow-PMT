import { ICreateInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/ICreateInvitationUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import {
  AppMessages,
  CreateInvitationSchema,
  HttpStatusCode,
  ResponseHandler,
  WorkspaceRoleEnum,
} from "shared";

export class InvitationController {
  constructor(
    private readonly _createInvitationUseCase: ICreateInvitationUseCase,
  ) {}

  inviteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = CreateInvitationSchema.parse(req.body);

      const workspaceId = req.params.workspaceId;
      const inviterId = (req as any).user?.userId;

      await this._createInvitationUseCase.execute({
        workspaceId,
        inviterId,
        email: validatedData.email,
        role: validatedData.role as WorkspaceRoleEnum,
      });

      res
        .status(HttpStatusCode.CREATED)
        .json(ResponseHandler.success(AppMessages.INVITATION_SENT_SUCCESS));
    },
  );
}
