export interface UpdateUserProfileDto {
  fullName?: string;
  profileImage?: string | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
