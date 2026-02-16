import { UserWithOrganizationsDTO } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetAllUsersWithOrganizationUsecase } from "@/application/interfaces/use-cases/SuperAdmin/IGetAllUsersWithOrganizationUseCase";

export class GetAllUsersWithOrganizationUseCase implements IGetAllUsersWithOrganizationUsecase {
  constructor(private _userRepo: IUserRepository) {}

  async execute():Promise<UserWithOrganizationsDTO[]> {
    return this._userRepo.getAllUsersWithOrganizations();
  }
}
