import { UserQueryOptions, PaginatedUsersResult } from "@/application/dtos/UserDtos";

export interface IGetAllUsersWithOrganizationUsecase {
  execute(options: UserQueryOptions): Promise<PaginatedUsersResult>;
}
