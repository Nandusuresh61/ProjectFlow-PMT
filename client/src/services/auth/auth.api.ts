import { API } from "@/services/api";
import { API_ROUTES } from "@/constants/api.constants";
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
  const { data } = await API.post<ApiResponse<null>>(API_ROUTES.AUTH.REGISTER, payload);
  return data;
};

export const verifyUserOtp = async (
  payload: OtpPayload,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    API_ROUTES.AUTH.VERIFY_OTP,
    payload,
  );
  return data;
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(
    API_ROUTES.AUTH.LOGIN,
    payload,
  );
  return data;
};

export const getMe = async (): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.get<ApiResponse<AuthData>>(API_ROUTES.AUTH.GET_ME);
  return data;
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(API_ROUTES.AUTH.LOGOUT);
  return data;
};

export const forgotPassoword = async (
  email: string,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
  return data;
};

export const resetPassword = async (
  payload: ResetPasswordOtpPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(
    API_ROUTES.AUTH.RESET_PASSWORD,
    payload,
  );
  return data;
};

export const resendOtp = async (
  payload: ResendOtpPayload,
): Promise<ApiResponse<null>> => {
  const { data } = await API.post<ApiResponse<null>>(
    API_ROUTES.AUTH.RESEND_OTP,
    payload,
  );
  return data;
};

export const googleAuth = async (
  code: string,
): Promise<ApiResponse<AuthData>> => {
  const { data } = await API.post<ApiResponse<AuthData>>(API_ROUTES.AUTH.GOOGLE, {
    code,
  });
  return data;
};
