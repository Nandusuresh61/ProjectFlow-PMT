import { AssignIssueToSprintDto } from "@/application/dtos/SprintDto";
import { Issue } from "@/domain/entities/Issue";

export interface IAssignIssueToSprintUseCase {
  execute(userId: string, data: AssignIssueToSprintDto): Promise<Issue>;
}
