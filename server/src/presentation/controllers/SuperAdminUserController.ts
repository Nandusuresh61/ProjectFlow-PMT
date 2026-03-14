import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { GetUserDetailsUseCase } from "@/application/use-cases/Admin/GetUserDetailsUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages, HttpStatusCode, ResponseHandler, AppError, ErrorCode } from "shared";
import { IGetAllUsersWithWorkspaceUsecase } from "@/application/interfaces/use-cases/SuperAdmin/IGetAllUsersWithWorkspaceUseCase";
import { IGetUserDetailsUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IGetUserDetailsUseCase";

export class SuperAdminUserController {
  constructor(
    private readonly _getAllUsersWithWorkspaceUseCase: IGetAllUsersWithWorkspaceUsecase,
    private readonly _getUserDetailsUseCase: IGetUserDetailsUseCase,
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
}
