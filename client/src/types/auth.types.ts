export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
}

export interface AuthData {
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordOtpPayload {
  email: string;
  otp: string;
  password: string;
}
