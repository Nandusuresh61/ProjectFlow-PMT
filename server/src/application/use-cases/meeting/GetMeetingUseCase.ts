import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";

export class GetMeetingUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) {}

  async execute(meetingId: string, userId: string): Promise<MeetingResponseDTO> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (!meeting.participants.includes(userId)) {
      throw new Error("You are not authorized to join this meeting");
    }

    if (meeting.status !== "ENDED") {
      const now = new Date();
      const scheduledTime = new Date(meeting.scheduledAt);
      const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
      
      if (now.getTime() < scheduledTime.getTime() - bufferMs) {
        throw new Error(`This meeting hasn't started yet. It is scheduled for ${scheduledTime.toLocaleString()}`);
      }
    }

    return meeting;
  }
}
