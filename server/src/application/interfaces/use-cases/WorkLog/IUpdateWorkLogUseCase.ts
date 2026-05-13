import { WorkLog } from "@/domain/entities/WorkLog";

export interface UpdateWorkLogDto {
  hours?: number;
  note?: string;
}

export interface IUpdateWorkLogUseCase {
  execute(userId: string, workLogId: string, data: UpdateWorkLogDto): Promise<WorkLog>;
}
