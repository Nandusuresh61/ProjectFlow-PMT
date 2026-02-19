export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
  isOnboarded: boolean;
  currentWorkspaceId?: string;
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

export interface ResendOtpPayload {
  email: string;
}