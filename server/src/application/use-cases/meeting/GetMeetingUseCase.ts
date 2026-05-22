import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { IGetMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IGetMeetingUseCase";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetMeetingUseCase implements IGetMeetingUseCase {
  constructor(private readonly meetingRepo: IMeetingRepository) {}

  async execute(meetingId: string, userId: string): Promise<MeetingResponseDTO> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.MEETING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (!meeting.participants.includes(userId)) {
      throw new AppError(ErrorCode.AUTH, AppMessages.MEETING_UNAUTHORIZED, HttpStatusCode.FORBIDDEN);
    }

    if (meeting.status !== "ENDED") {
      const now = new Date();
      const scheduledTime = new Date(meeting.scheduledAt);
      const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
      
      if (now.getTime() < scheduledTime.getTime() - bufferMs) {
        throw new AppError(ErrorCode.INVALID_OPERATION, `This meeting hasn't started yet. It is scheduled for ${scheduledTime.toLocaleString()}`, HttpStatusCode.BAD_REQUEST);
      }
    }

    return meeting;
  }
}
