export interface Workspace {
  workspaceId: string;
  name: string;
  role: string;
}

export interface UserWithWorkspaces {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
  workspaces: Workspace[];
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsers {
  users: UserWithWorkspaces[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
