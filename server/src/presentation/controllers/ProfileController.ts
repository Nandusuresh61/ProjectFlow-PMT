import { IGetUserProfileUseCase } from "@/application/interfaces/use-cases/User/IGetUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@/application/interfaces/use-cases/User/IUpdateUserProfileUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { UpdateUserProfileSchema } from "@/shared/schema/profile/UpdateUserProfileSchema";
import { logger } from "@/infrastructure/utils/Logger";
import { IChangePasswordUseCase } from "@/application/interfaces/use-cases/User/IChangePasswordUseCase";
import { ChangePasswordSchema } from "@/shared/schema/auth/ChangePasswordSchema";

export class ProfileController {
  constructor(
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
  ) {}

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.user!;

    const result = await this._getUserProfileUseCase.execute(userId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = UpdateUserProfileSchema.parse(req.body);

    logger.info("log from proile controller", validatedData);

    await this._updateUserProfileUseCase.execute(userId, validatedData);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.USER_PROFILE_UPDATED));
  });

  changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const validatedData = ChangePasswordSchema.parse(req.body);

    await this._changePasswordUseCase.execute(userId, validatedData);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.PASSWORD_CHANGED_SUCCESSFUL));
  });
}
