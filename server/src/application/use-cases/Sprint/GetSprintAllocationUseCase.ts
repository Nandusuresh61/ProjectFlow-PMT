import { ISprintMemberAllocationRepository } from "@/application/interfaces/repositories/ISprintMemberAllocationRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { SprintMemberAllocation } from "@/domain/entities/SprintMemberAllocation";

export interface SprintMemberAllocationResponse {
  sprintId: string;
  members: {
    userId: string;
    fullName: string;
    profileImage: string | null;
    assignedHours: number;
    loggedHours: number;
    remainingHours: number;
    completedTasks: number;
    incompleteTasks: number;
    capacityStatus: string;
  }[];
  totals: {
    assignedHours: number;
    loggedHours: number;
    remainingHours: number;
  };
}

export class GetSprintAllocationUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _allocationRepo: ISprintMemberAllocationRepository,
    private readonly _userRepo: IUserRepository
  ) {}

  async execute(sprintId: string): Promise<SprintMemberAllocationResponse> {
    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) {
      throw new Error("Sprint not found");
    }

    const allocations = await this._allocationRepo.findBySprintId(sprintId);
    
    // Fetch user details for each member
    const memberDetails = await Promise.all(
      allocations.map(async (allocation) => {
        const user = await this._userRepo.findById(allocation.userId);
        return {
          userId: allocation.userId,
          fullName: user ? user.fullName : "Unknown User",
          profileImage: user?.profileImage || null,
          assignedHours: allocation.assignedHours,
          loggedHours: allocation.loggedHours,
          remainingHours: allocation.remainingHours,
          completedTasks: allocation.completedTasks,
          incompleteTasks: allocation.incompleteTasks,
          capacityStatus: allocation.capacityStatus,
        };
      })
    );

    const totals = allocations.reduce(
      (acc, curr) => {
        acc.assignedHours += curr.assignedHours;
        acc.loggedHours += curr.loggedHours;
        acc.remainingHours += curr.remainingHours;
        return acc;
      },
      { assignedHours: 0, loggedHours: 0, remainingHours: 0 }
    );

    // Round totals
    totals.assignedHours = Math.round(totals.assignedHours * 100) / 100;
    totals.loggedHours = Math.round(totals.loggedHours * 100) / 100;
    totals.remainingHours = Math.round(totals.remainingHours * 100) / 100;

    return {
      sprintId,
      members: memberDetails,
      totals,
    };
  }
}
