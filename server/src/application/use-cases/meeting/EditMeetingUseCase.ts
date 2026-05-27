import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { EditMeetingDTO, MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { IWorkspaceEventTrackingService } from "@/application/interfaces/services/IWorkspaceEventTrackingService";
import { IEditMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IEditMeetingUseCase";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class EditMeetingUseCase implements IEditMeetingUseCase {
  constructor(
    private readonly meetingRepo: IMeetingRepository,
    private readonly eventTrackingService: IWorkspaceEventTrackingService
  ) {}

  async execute(dto: EditMeetingDTO, userId: string): Promise<MeetingResponseDTO> {
    const meeting = await this.meetingRepo.findById(dto.meetingId);
    if (!meeting) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.MEETING_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    if (meeting.hostId !== userId) {
      throw new AppError(ErrorCode.AUTH, AppMessages.MEETING_HOST_ONLY_EDIT, HttpStatusCode.FORBIDDEN);
    }

    // Add host back to participants if not present
    const participantsSet = new Set(dto.participants);
    participantsSet.add(meeting.hostId);

    const updated = await this.meetingRepo.update(dto.meetingId, {
      title: dto.title,
      participants: Array.from(participantsSet),
      scheduledAt: dto.scheduledAt,
      duration: dto.duration
    });

    if (!updated) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, AppMessages.MEETING_UPDATE_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    // Track activity
    await this.eventTrackingService.trackEvent({
      workspaceId: updated.workspaceId,
      actorId: userId,
      eventType: "PROJECT_UPDATED",
      entityType: "WORKSPACE",
      entityId: updated.workspaceId,
      metadata: {
        action: "MEETING_UPDATED",
        meetingId: updated.meetingId,
        title: updated.title
      }
    });

    return updated;
  }
}
