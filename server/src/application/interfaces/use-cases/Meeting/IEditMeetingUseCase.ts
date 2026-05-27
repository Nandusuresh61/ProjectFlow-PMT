import { EditMeetingDTO, MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export interface IEditMeetingUseCase {
  execute(dto: EditMeetingDTO, userId: string): Promise<MeetingResponseDTO>;
}
