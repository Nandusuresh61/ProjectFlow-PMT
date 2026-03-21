export interface IUser {
  userId: string;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
  isBlocked: boolean;
  currentWorkspaceId?: string;
  profileImage?: string | null;
  membershipCount?: number;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  isBlocked: boolean;
}
