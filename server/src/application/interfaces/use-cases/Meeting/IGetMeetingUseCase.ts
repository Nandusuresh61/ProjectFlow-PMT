import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export interface IGetMeetingUseCase {
  execute(meetingId: string, userId: string): Promise<MeetingResponseDTO>;
}
