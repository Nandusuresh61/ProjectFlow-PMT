export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export class Project {
  constructor(
    public readonly projectId: string,
    public projectKey: string,
    public name: string,
    public description: string | null,
    public workspaceId: string,
    public createdBy: string,
    public memberIds: string[],
    public status: ProjectStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
