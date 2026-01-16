export interface User {
  id: string;
  fullName: string;
  email: string;
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

export interface AuthResponse {
  user: User;
  message: string
}
