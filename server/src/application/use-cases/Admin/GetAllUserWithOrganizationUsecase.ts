import { UserQueryOptions, PaginatedUsersResult } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetAllUsersWithOrganizationUsecase } from "@/application/interfaces/use-cases/SuperAdmin/IGetAllUsersWithOrganizationUseCase";

export class GetAllUsersWithOrganizationUseCase implements IGetAllUsersWithOrganizationUsecase {
  constructor(private _userRepo: IUserRepository) { }

  async execute(options: UserQueryOptions): Promise<PaginatedUsersResult> {
    return this._userRepo.getAllUsersWithOrganizations(options);
  }
}
