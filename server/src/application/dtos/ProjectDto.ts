export interface CreateProjectDto {
  workspaceId: string;
  projectKey: string;
  name: string;
  description?: string | null;
  memberIds?: string[];
}

export interface UpdateProjectDto {
  projectKey?: string;
  name?: string;
  description?: string | null;
  memberIds?: string[];
}
