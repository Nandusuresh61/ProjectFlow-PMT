export interface Workspace {
  workspaceId: string;
  name: string;
  role: string;
}

export interface UserWithWorkspaces {
  userId: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  isSuperAdmin: boolean;
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

export interface UserWorkspaceDetails {
  workspaceId: string;
  name: string;
  role: string;
  planName: string;
  ownerName: string;
  memberCount: number;
}

export interface UserDetails {
  userId: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  isSuperAdmin: boolean;
  profileImage?: string;
  createdAt: string;
  workspaces: UserWorkspaceDetails[];
}
export interface WorkspaceDetails {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  planExpireDate: string | null;
  projectCount: number;
  memberCount: number;
  isSuspended: boolean;
}

export interface WorkspaceWithDetails {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  isSuspended: boolean;
  createdAt: string;
}

export interface PaginatedWorkspaces {
  workspaces: WorkspaceWithDetails[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DashboardStats {
  totalWorkspaces: number;
  totalWorkspacesChange: number;
  totalUsers: number;
  totalUsersChange: number;
  activeSubscriptions: number;
  activeSubscriptionsChange: number;
  pendingTickets: number;
  revenueThisMonth: number;
  revenueThisMonthChange: number;
  newWorkspacesThisMonth: number;
  newWorkspacesThisMonthChange: number;
}

export interface RevenueOverview {
  monthlyRevenue: number;
  yearlyRevenue: number;
  activePaidOrganizations: number;
  monthlyHistory: { month: string; revenue: number }[];
}

export interface WorkspaceGrowth {
  newlyCreated: number;
  trial: number;
  upgraded: number;
  growthHistory: { month: string; count: number }[];
}

export interface RecentWorkspace {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  membersCount: number;
  createdAt: string;
  status: "active" | "suspended" | "trial";
}

export interface PendingTicket {
  ticketId: string;
  title: string;
  workspaceName: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
}

