import type { ApiResponse } from "@/types/auth.types";
import type { GetUsersParams, PaginatedUsers } from "@/types/superadmin.types";
import { API } from "../api";

export const getAllUsers = async (
  params: GetUsersParams,
): Promise<ApiResponse<PaginatedUsers>> => {
  const { data } = await API.get("/super-admin/getusers", { params });

  return data;
};
