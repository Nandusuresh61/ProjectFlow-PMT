export type CapacityStatus = "UNDERLOADED" | "HEALTHY" | "OVERLOADED";

export class SprintMemberAllocation {
  constructor(
    public readonly allocationId: string,
    public readonly sprintId: string,
    public readonly projectId: string,
    public readonly workspaceId: string,
    public readonly userId: string,
    public assignedHours: number,
    public loggedHours: number,
    public remainingHours: number,
    public completedTasks: number,
    public incompleteTasks: number,
    public capacityStatus: CapacityStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
