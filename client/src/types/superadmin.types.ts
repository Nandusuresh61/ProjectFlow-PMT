export interface Organization {
  organizationId: string;
  name: string;
  role: string;
}

export interface UserWithOrganizations {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
  organizations: Organization[];
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsers {
  users: UserWithOrganizations[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
