import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export class GetWorkspaceMeetingsUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) { }

  async execute(workspaceId: string, userId: string): Promise<MeetingResponseDTO[]> {
    return await this.meetingRepo.findByWorkspace(workspaceId);
  }
}
