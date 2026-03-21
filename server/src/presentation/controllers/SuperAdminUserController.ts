import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { GetUserDetailsUseCase } from "@/application/use-cases/Admin/GetUserDetailsUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { IGetAllUsersWithWorkspaceUsecase } from "@/application/interfaces/use-cases/SuperAdmin/IGetAllUsersWithWorkspaceUseCase";
import { IGetUserDetailsUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IGetUserDetailsUseCase";
import { IToggleUserBlockUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IToggleUserBlockUseCase";

export class SuperAdminUserController {
  constructor(
    private readonly _getAllUsersWithWorkspaceUseCase: IGetAllUsersWithWorkspaceUsecase,
    private readonly _getUserDetailsUseCase: IGetUserDetailsUseCase,
    private readonly _toggleUserBlockUseCase: IToggleUserBlockUseCase,
  ) { }
  getAllUsersWithWorkspaces = asyncHandler(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await this._getAllUsersWithWorkspaceUseCase.execute({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(AppMessages.USER_FETCHING_SUCCESSFUL, result),
        );
    },
  );

  getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await this._getUserDetailsUseCase.execute(userId);

    if (!result) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.USER_FETCHING_SUCCESSFUL, result),
      );
  });

  toggleUserBlock = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._toggleUserBlockUseCase.execute(userId);

    res
      .status(HttpStatusCode.OK)
      .json(
        ResponseHandler.success(AppMessages.USER_BLOCK_STATUS_UPDATED, null),
      );
  });
}
