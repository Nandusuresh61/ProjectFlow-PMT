import { LoginUserSchemaType, RegisterUserSchemaType } from "shared";

export type RegisterVerifiedUserDto = {
  fullName: string;
  email: string;
  passwordHash: string;
};

export type UserAuthResponseDto = {
  user: {
    userId: string;
    fullName: string;
    email: string;
    isSuperAdmin: boolean;
    isOnboarded: boolean,
    currentOrganizationId: string,
  };
  accessToken: string;
  refreshToken: string;
};

export type StartRegisterDto = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type ForgotRequestDto = {
  email: string;
};

export type ResetPasswordRequestDto = {
  email: string;
  otp: string;
  newPassword: string;
};


export interface UserWithOrganizationsDTO {
  userId: string;
  fullName: string;
  email: string;
  organizations: {
    organizationId: string;
    name: string;
    role: string;
  }[];
}
