import { ISprintAllocationCalculatorService } from "@/application/interfaces/services/ISprintAllocationCalculatorService";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { ISprintMemberAllocationRepository } from "@/application/interfaces/repositories/ISprintMemberAllocationRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { SprintMemberAllocation, CapacityStatus } from "@/domain/entities/SprintMemberAllocation";

export class SprintAllocationCalculatorService implements ISprintAllocationCalculatorService {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _workLogRepo: IWorkLogRepository,
    private readonly _allocationRepo: ISprintMemberAllocationRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async calculateAndSaveAllocation(sprintId: string): Promise<void> {
    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) return;

    // Fetch all issues in the sprint
    const issues = await this._issueRepo.findBySprintId(sprintId);
    
    // ONLY USE TASK and BUG
    const workloadIssues = issues.filter(i => i.type === "TASK" || i.type === "BUG");
    
    // Get worklogs for these issues
    const issueIds = workloadIssues.map(i => i.issueId);
    const loggedHoursByIssue = await this._workLogRepo.getTotalLoggedHoursByIssueIds(issueIds);

    // Group by assignee
    const allocationMap = new Map<string, {
      assignedHours: number;
      loggedHours: number;
      remainingHours: number;
      completedTasks: number;
      incompleteTasks: number;
      workspaceId: string;
    }>();

    for (const issue of workloadIssues) {
      const assigneeId = issue.assigneeId;
      if (!assigneeId) continue; // Ignore unassigned tasks for per-member allocation

      if (!allocationMap.has(assigneeId)) {
        allocationMap.set(assigneeId, {
          assignedHours: 0,
          loggedHours: 0,
          remainingHours: 0,
          completedTasks: 0,
          incompleteTasks: 0,
          workspaceId: issue.workspaceId
        });
      }

      const data = allocationMap.get(assigneeId)!;
      data.assignedHours += issue.estimatedHours || 0;
      data.remainingHours += issue.remainingHours || 0;
      data.loggedHours += loggedHoursByIssue[issue.issueId] || 0;

      if (issue.status === "DONE") {
        data.completedTasks += 1;
      } else {
        data.incompleteTasks += 1;
      }
    }

    // Save/Update allocations
    for (const [userId, data] of allocationMap.entries()) {
      const capacityStatus = this.determineCapacityStatus(data.assignedHours);
      
      const existing = await this._allocationRepo.findBySprintIdAndUserId(sprintId, userId);
      
      const allocation = new SprintMemberAllocation(
        existing?.allocationId || this._uidGenerator.createId(),
        sprintId,
        sprint.projectId,
        data.workspaceId,
        userId,
        this.round(data.assignedHours),
        this.round(data.loggedHours),
        this.round(data.remainingHours),
        data.completedTasks,
        data.incompleteTasks,
        capacityStatus,
        existing?.createdAt || new Date(),
        new Date()
      );

      await this._allocationRepo.upsert(allocation);
    }

    
    const currentAllocations = await this._allocationRepo.findBySprintId(sprintId);
    for (const allocation of currentAllocations) {
      if (!allocationMap.has(allocation.userId)) {
      
      }
    }
  }

  async getSprintAllocation(sprintId: string): Promise<SprintMemberAllocation[]> {
    return this._allocationRepo.findBySprintId(sprintId);
  }

  private determineCapacityStatus(assignedHours: number): CapacityStatus {
    if (assignedHours < 20) return "UNDERLOADED";
    if (assignedHours <= 40) return "HEALTHY";
    return "OVERLOADED";
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
