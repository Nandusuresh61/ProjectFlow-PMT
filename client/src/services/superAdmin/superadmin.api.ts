import type { ApiResponse } from "@/types/auth.types";
import type { GetUsersParams, PaginatedUsers, UserDetails } from "@/types/superadmin.types";
import { API } from "../api";

export const getAllUsers = async (
  params: GetUsersParams,
): Promise<ApiResponse<PaginatedUsers>> => {
  const { data } = await API.get("/super-admin/getusers", { params });

  return data;
};

export const getUserDetails = async (
  userId: string
): Promise<ApiResponse<UserDetails>> => {
  const { data } = await API.get(`/super-admin/user/${userId}`);
  return data;
};
