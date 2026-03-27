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
    isBlocked: boolean;
    currentWorkspaceId?: string;
    membershipCount: number;
    profileImage?: string | null;
  };
  accessToken: string;
  refreshToken: string;
};

export interface GetMeResponseDto {
  userId: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
  currentWorkspaceId?: string;
  membershipCount: number;
  profileImage?: string | null;
}


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


export interface UserWithWorkspacesDTO {
  userId: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  profileImage?: string;
  createdAt: Date;
  workspaces: {
    workspaceId: string;
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
  users: UserWithWorkspacesDTO[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UserWorkspaceDetails {
  workspaceId: string;
  name: string;
  role: string;
  planName: string;
  ownerName: string;
  memberCount: number;
}

export interface UserDetailsDto {
  userId: string;
  fullName: string;
  email: string;
  isBlocked: boolean;
  profileImage?: string;
  createdAt: Date;
  workspaces: UserWorkspaceDetails[];
}
