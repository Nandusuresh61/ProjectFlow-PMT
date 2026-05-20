export interface DashboardStatsDto {
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

export interface RevenueOverviewDto {
  monthlyRevenue: number;
  yearlyRevenue: number;
  activePaidOrganizations: number;
  monthlyHistory: { month: string; revenue: number }[];
}

export interface WorkspaceGrowthDto {
  newlyCreated: number;
  trial: number;
  upgraded: number;
  growthHistory: { month: string; count: number }[];
}

export interface RecentWorkspaceDto {
  workspaceId: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  planName: string;
  membersCount: number;
  createdAt: Date;
  status: "active" | "suspended" | "trial";
}

export interface PendingTicketDto {
  ticketId: string;
  title: string;
  workspaceName: string;
  priority: string;
  status: string;
  createdAt: Date;
}
