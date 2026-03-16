import { IGetUserProfileUseCase } from "@/application/interfaces/use-cases/User/IGetUserProfileUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages, HttpStatusCode, ResponseHandler } from "shared";

export class ProfileController {
  constructor(
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,
  ) {}

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    let result = await this._getUserProfileUseCase.execute(userId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });
}
