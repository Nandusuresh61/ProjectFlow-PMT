import type { ApiResponse } from "@/types/auth.types";
import type { 
  GetUsersParams, 
  PaginatedUsers, 
  UserDetails, 
  PaginatedWorkspaces, 
  WorkspaceDetails 
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
