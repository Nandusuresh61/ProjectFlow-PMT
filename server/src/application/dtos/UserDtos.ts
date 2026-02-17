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
  createdAt: Date;
  organizations: {
    organizationId: string;
    name: string;
    role: string;
  }[];
}

export interface UserQueryOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsersResult {
  users: UserWithOrganizationsDTO[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
