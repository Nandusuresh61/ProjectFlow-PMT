import {
  DashboardStatsDto,
  RevenueOverviewDto,
  WorkspaceGrowthDto,
  RecentWorkspaceDto,
  PendingTicketDto
} from "@/application/dtos/SuperAdminDashboardDto";

export interface IGetSuperAdminDashboardUseCase {
  getStats(): Promise<DashboardStatsDto>;
  getRevenueOverview(): Promise<RevenueOverviewDto>;
  getWorkspaceGrowth(): Promise<WorkspaceGrowthDto>;
  getRecentWorkspaces(page?: number, limit?: number): Promise<{ workspaces: RecentWorkspaceDto[]; total: number }>;
  getPendingTickets(page?: number, limit?: number): Promise<{ tickets: PendingTicketDto[]; total: number }>;
}
