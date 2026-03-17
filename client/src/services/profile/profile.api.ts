import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";
import type { ApiResponse, User } from "../../types/auth.types";

export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await API.get<ApiResponse<User>>(API_ROUTES.PROFILE.GET);

  return response.data;
};
