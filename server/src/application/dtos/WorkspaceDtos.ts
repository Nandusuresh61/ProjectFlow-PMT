export interface WorkspaceQueryOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface WorkspaceWithDetailsDto {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  isSuspended: boolean;
  createdAt: Date;
}

export interface PaginatedWorkspacesResult {
  workspaces: WorkspaceWithDetailsDto[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface WorkspaceDetailsDto {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  planExpireDate: Date | null;
  projectCount: number;
  memberCount: number;
  isSuspended: boolean;
}
