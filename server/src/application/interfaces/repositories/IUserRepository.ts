import { UserQueryOptions, PaginatedUsersResult, UserDetailsDto } from "@/application/dtos/UserDtos";
import { User } from "@/domain/entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updatePasswordByEmail(email: string, passwordHash: string): Promise<void>;
  update(user: User): Promise<void>;
  getAllUsersWithWorkspaces(options: UserQueryOptions): Promise<PaginatedUsersResult>;
  getUserDetails(userId: string): Promise<UserDetailsDto | null>;
  updateCurrentWorkspace(userId:string,currentWorkspaceId: string): Promise<void>

}
