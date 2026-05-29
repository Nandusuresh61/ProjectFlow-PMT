import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { IGetWorkspaceMeetingsUseCase } from "@/application/interfaces/use-cases/Meeting/IGetWorkspaceMeetingsUseCase";

export class GetWorkspaceMeetingsUseCase implements IGetWorkspaceMeetingsUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) { }

  async execute(workspaceId: string, _userId: string): Promise<MeetingResponseDTO[]> {
    return await this.meetingRepo.findByWorkspace(workspaceId);
  }
}
