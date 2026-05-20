import type { ApiResponse } from "@/types/auth.types";
import type { 
  GetUsersParams, 
  PaginatedUsers, 
  UserDetails, 
  PaginatedWorkspaces, 
  WorkspaceDetails,
  DashboardStats,
  RevenueOverview,
  WorkspaceGrowth,
  RecentWorkspace,
  PendingTicket
} from "@/types/superadmin.types";
import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

export const getAllUsers = async (
  params: GetUsersParams,
): Promise<ApiResponse<PaginatedUsers>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.GET_USERS, { params });

  return data;
};

export const getUserDetails = async (
  userId: string
): Promise<ApiResponse<UserDetails>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.USER_DETAILS(userId));
  return data;
};

export const toggleBlockUser = async (
  userId: string
): Promise<ApiResponse<null>> => {
  const { data } = await API.patch(API_ROUTES.SUPER_ADMIN.TOGGLE_BLOCK(userId));
  return data;
};

export const getAllWorkspaces = async (
  params: GetUsersParams,
): Promise<ApiResponse<PaginatedWorkspaces>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.GET_WORKSPACES, { params });
  return data;
};

export const getWorkspaceDetails = async (
  workspaceId: string
): Promise<ApiResponse<WorkspaceDetails>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.WORKSPACE_DETAILS(workspaceId));
  return data;
};

export const toggleSuspendWorkspace = async (
  workspaceId: string
): Promise<ApiResponse<null>> => {
  const { data } = await API.patch(API_ROUTES.SUPER_ADMIN.TOGGLE_SUSPEND(workspaceId));
  return data;
};

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.DASHBOARD_STATS);
  return data;
};

export const getRevenueOverview = async (): Promise<ApiResponse<RevenueOverview>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.DASHBOARD_REVENUE);
  return data;
};

export const getWorkspaceGrowth = async (): Promise<ApiResponse<WorkspaceGrowth>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.DASHBOARD_GROWTH);
  return data;
};

export const getRecentWorkspaces = async (
  page: number = 1,
  limit: number = 5
): Promise<ApiResponse<{ workspaces: RecentWorkspace[]; total: number }>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.DASHBOARD_RECENT_WORKSPACES, {
    params: { page, limit },
  });
  return data;
};

export const getPendingTickets = async (
  page: number = 1,
  limit: number = 5
): Promise<ApiResponse<{ tickets: PendingTicket[]; total: number }>> => {
  const { data } = await API.get(API_ROUTES.SUPER_ADMIN.DASHBOARD_PENDING_TICKETS, {
    params: { page, limit },
  });
  return data;
};

