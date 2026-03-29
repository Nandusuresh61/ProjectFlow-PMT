export interface CreateProjectDto {
  workspaceId: string;
  name: string;
  description?: string | null;
  memberIds?: string[];
}

export interface UpdateProjectDto {
  name?: string;
  description?: string | null;
  memberIds?: string[];
}
