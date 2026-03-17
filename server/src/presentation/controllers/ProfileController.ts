import { IGetUserProfileUseCase } from "@/application/interfaces/use-cases/User/IGetUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@/application/interfaces/use-cases/User/IUpdateUserProfileUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { AppMessages, HttpStatusCode, ResponseHandler } from "shared";

export class ProfileController {
  constructor(
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
  ) {}

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.user!;

    let result = await this._getUserProfileUseCase.execute(userId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  updateProfile = asyncHandler(async(req: Request, res: Response) =>{
    const {userId, data} = req.body;

    await this._updateUserProfileUseCase.execute(userId, data);


    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS));
  })
}
