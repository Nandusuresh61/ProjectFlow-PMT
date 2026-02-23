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

      await Promise.all(
        validatedData.invites.map((invite) =>
          this._createInvitationUseCase.execute({
            workspaceId,
            inviterId,
            email: invite.email,
            role: invite.role,
          }),
        ),
      );
      res
        .status(HttpStatusCode.CREATED)
        .json(ResponseHandler.success(AppMessages.INVITATION_SENT_SUCCESS));
    },
  );
}
