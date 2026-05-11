import { WorkLog } from "@/domain/entities/WorkLog";

export interface AddWorkLogDto {
  hours: number;
  note?: string;
}

export interface IAddWorkLogUseCase {
  execute(userId: string, issueId: string, data: AddWorkLogDto): Promise<WorkLog>;
}
