import type { ApiResponse } from "@/types/auth.types";
import type { GetUsersParams, PaginatedUsers, UserDetails } from "@/types/superadmin.types";
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
