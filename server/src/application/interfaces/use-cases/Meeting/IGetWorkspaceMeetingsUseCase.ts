import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export interface IGetWorkspaceMeetingsUseCase {
  execute(workspaceId: string, userId: string): Promise<MeetingResponseDTO[]>;
}
