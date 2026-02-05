import { API } from "@/services/api";
import type {
  ApiResponse,
  ResendOtpPayload,
  ResetPasswordOtpPayload,
} from "@/types/auth.types";
import type {
  AuthData,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
} from "@/types/auth.types";

export const registerUser = async (
  payload: RegisterPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>("/auth/register", payload);
  return data;
};

export const verifyUserOtp = async (
  payload: OtpPayload,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    "/auth/verify-otp",
    payload,
  );
  return data;
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    "/auth/login",
    payload,
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

export const forgotPassoword = async (
  email: string,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>("auth/forgot", { email });
  return data;
};

export const resetPassword = async (
  payload: ResetPasswordOtpPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(
    "auth/reset-password",
    payload,
  );
  return data;
};

export const resendOtp = async (
  payload: ResendOtpPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(
    "auth/resend-otp",
    payload,
  );
  return data;
};

export const googleAuth = async (
  code: string,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>("/auth/google", {
    code,
  });
  return data;
};
