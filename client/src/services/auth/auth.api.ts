import { API } from "@/services/api";
import type {
  AuthResponse,
  LoginPayload, 
  OtpPayload,
  RegisterPayload,
} from "@/types/auth.types";

export const registerUser = async (payload: RegisterPayload): Promise<{message:string}> => {
  const { data } = await API.post("/auth/register", payload);
  return data;
};

export const verifyUserOtp = async (payload: OtpPayload): Promise<AuthResponse> => {
  const {data } =await API.post("/auth/verify-otp",payload);
  return data
}

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await API.post("/auth/login", payload);
  return data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const { data } = await API.post("/auth/getme");
  return data;
};

export const logoutUser = async () => {
  await API.post("/auth/logout");
};
