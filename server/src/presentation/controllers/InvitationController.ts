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
import { IAcceptInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/IAcceptInvitationUseCase";

export class InvitationController {
  constructor(
    private readonly _createInvitationUseCase: ICreateInvitationUseCase,
    private readonly _acceptInvitationUseCase: IAcceptInvitationUseCase
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

  acceptInvitation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    const userId = (req as any).user?.userId;

    const result = await this._acceptInvitationUseCase.execute(token, userId);

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(
        AppMessages.INVITATION_ACCEPTED,
        result
      )
    );
  }
);
}
