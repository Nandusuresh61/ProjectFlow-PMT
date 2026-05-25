import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export interface IEndMeetingUseCase {
  execute(meetingId: string, userId: string): Promise<MeetingResponseDTO>;
}
