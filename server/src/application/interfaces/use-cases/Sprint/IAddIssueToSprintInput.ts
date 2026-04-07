import { AddIssueToSprintDto } from "@/application/dtos/SprintDto";

export interface IAddIssueToSprintUseCase {
  execute(data: AddIssueToSprintDto): Promise<void>;
}
