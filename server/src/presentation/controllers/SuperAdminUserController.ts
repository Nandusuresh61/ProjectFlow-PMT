import { GetAllUsersWithOrganizationUseCase } from "@/application/use-cases/Admin/GetAllUserWithOrganizationUsecase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages, HttpStatusCode, ResponseHandler } from "shared";

export class SuperAdminUserController {
  constructor(
    private readonly _getAllUsersWithOrganizationUseCase: GetAllUsersWithOrganizationUseCase,
  ) {}
  getAllUsersWithOrganizations = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this._getAllUsersWithOrganizationUseCase.execute();
      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(AppMessages.USER_FETCHING_SUCCESSFUL, result),
        );
    },
  );
}
