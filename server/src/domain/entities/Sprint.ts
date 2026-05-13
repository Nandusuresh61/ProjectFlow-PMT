export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
export class Sprint {
  constructor(
    public readonly sprintId: string,
    public projectId: string,
    public name: string,

    public status: SprintStatus,
    public issueIds: string[],
    public createdAt: Date,
    public updatedAt: Date,

    public goal?: string,
    public startDate?: Date,
    public endDate?: Date,
    public plannedPoints?: number,
    public completedPoints?: number,
  ) {}
}
