import type {
  ApiResponse,
  changePasswordPayload,
  User,
} from "@/types/auth.types";
import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

export const changePassword = async (
  data: changePasswordPayload,
): Promise<ApiResponse<User>> => {
  const response = await API.put(API_ROUTES.SECURITY.UPDATE, data);
  return response.data;
};
