import { Workspace } from "@/domain/entities/Workspace";

export interface IGetUserWorkspacesUseCase {
  execute(userId: string): Promise<Workspace[]>;
}
