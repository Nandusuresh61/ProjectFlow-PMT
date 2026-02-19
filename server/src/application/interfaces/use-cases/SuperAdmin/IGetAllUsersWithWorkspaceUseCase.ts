import { UserQueryOptions, PaginatedUsersResult } from "@/application/dtos/UserDtos";

export interface IGetAllUsersWithWorkspaceUsecase {
  execute(options: UserQueryOptions): Promise<PaginatedUsersResult>;
}
