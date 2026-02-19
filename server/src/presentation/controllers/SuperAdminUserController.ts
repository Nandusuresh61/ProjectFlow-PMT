import { GetAllUsersWithWorkspaceUseCase } from "@/application/use-cases/Admin/GetAllUserWithWorkspaceUsecase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages, HttpStatusCode, ResponseHandler } from "shared";

export class SuperAdminUserController {
  constructor(
    private readonly _getAllUsersWithWorkspaceUseCase: GetAllUsersWithWorkspaceUseCase,
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
}
