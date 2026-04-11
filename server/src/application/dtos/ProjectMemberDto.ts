export interface ProjectMemberDto {
  userId: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  role: string; // Workspace role for now
  activeTasksCount: number;
  status: 'online' | 'away' | 'offline';
}
