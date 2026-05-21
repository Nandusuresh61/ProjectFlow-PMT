import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { WorkspaceEventTrackingService } from "@/application/services/WorkspaceEventTrackingService";

export class EndMeetingUseCase {
  constructor(
    private readonly meetingRepo: IMeetingRepository,
    private readonly eventTrackingService: WorkspaceEventTrackingService
  ) {}

  async execute(meetingId: string, userId: string): Promise<MeetingResponseDTO> {
    const meeting = await this.meetingRepo.findById(meetingId);
    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.hostId !== userId) {
      throw new Error("Only the host can end the meeting");
    }

    const updated = await this.meetingRepo.update(meetingId, {
      status: "ENDED",
      endedAt: new Date()
    });

    if (!updated) {
      throw new Error("Failed to end meeting");
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
