export interface IGetUserProfileUseCase {
  execute(userId: string): Promise<{
    userId: string;
    fullName: string;
    email: string;
    profileImage: string | null;
  }>;
}
