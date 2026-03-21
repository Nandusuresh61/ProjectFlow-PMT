import { ICreateInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/ICreateInvitationUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages } from "@/shared/messages/AppMessages";
import { CreateInvitationSchema } from "@/shared/schema/invitation/CreateInvitationSchema";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { IAcceptInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/IAcceptInvitationUseCase";
import { AuthRequest } from "../middlewares/AuthMiddleware";

export class InvitationController {
  constructor(
    private readonly _createInvitationUseCase: ICreateInvitationUseCase,
    private readonly _acceptInvitationUseCase: IAcceptInvitationUseCase
  ) {}

  inviteUser = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const validatedData = CreateInvitationSchema.parse(req.body);

      const workspaceId = req.params.workspaceId;
      const inviterId = req.user?.userId;

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
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { token } = req.body;
    const userId = req.user?.userId;

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
