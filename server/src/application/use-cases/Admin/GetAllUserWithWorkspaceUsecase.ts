import { UserQueryOptions, PaginatedUsersResult } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetAllUsersWithWorkspaceUsecase } from "@/application/interfaces/use-cases/SuperAdmin/IGetAllUsersWithWorkspaceUseCase";

export class GetAllUsersWithWorkspaceUseCase implements IGetAllUsersWithWorkspaceUsecase {
  constructor(private _userRepo: IUserRepository) { }

  async execute(options: UserQueryOptions): Promise<PaginatedUsersResult> {
    return this._userRepo.getAllUsersWithWorkspaces(options);
  }
}
