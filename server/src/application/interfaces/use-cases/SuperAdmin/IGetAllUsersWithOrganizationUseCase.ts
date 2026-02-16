import { UserWithOrganizationsDTO } from "@/application/dtos/UserDtos";

export interface IGetAllUsersWithOrganizationUsecase {
  execute(): Promise<UserWithOrganizationsDTO[]>;
}
