import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { IWorkspaceEventTrackingService } from "@/application/interfaces/services/IWorkspaceEventTrackingService";
import { IEndMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IEndMeetingUseCase";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class EndMeetingUseCase implements IEndMeetingUseCase {
  constructor(
    private readonly meetingRepo: IMeetingRepository,
    private readonly eventTrackingService: IWorkspaceEventTrackingService
  ) {}

  async execute(meetingId: string, userId: string): Promise<MeetingResponseDTO> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.MEETING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (meeting.hostId !== userId) {
      throw new AppError(ErrorCode.AUTH, AppMessages.MEETING_HOST_ONLY, HttpStatusCode.FORBIDDEN);
    }

    const updated = await this.meetingRepo.update(meetingId, {
      status: "ENDED",
      endedAt: new Date()
    });

    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, AppMessages.MEETING_END_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    // Track activity
    await this.eventTrackingService.trackEvent({
      workspaceId: updated.workspaceId,
      actorId: userId,
      eventType: "PROJECT_UPDATED",
      entityType: "WORKSPACE",
      entityId: updated.workspaceId,
      metadata: {
        action: "MEETING_ENDED",
        meetingId: updated.meetingId,
        title: updated.title
      }
    });

    return updated;
  }
}
