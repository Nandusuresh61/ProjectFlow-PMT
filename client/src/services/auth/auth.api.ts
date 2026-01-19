import { API } from "@/services/api";
import type { ApiResponse } from "@/types/auth.types";
import type {
  AuthData,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
} from "@/types/auth.types";

export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(
    "/auth/register",
    payload
  );
  return data;
};

export const verifyUserOtp = async (
  payload: OtpPayload
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    "/auth/verify-otp",
    payload
  );
  return data;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    "/auth/login",
    payload
  );
  return data;
};

export const getMe = async (): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.get<ApiResponse<AuthData>>("/auth/getme");
  return data;
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>("/auth/logout");
  return data;
};
