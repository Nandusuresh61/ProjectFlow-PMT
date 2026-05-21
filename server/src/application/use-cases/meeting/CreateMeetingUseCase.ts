import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { CreateMeetingDTO, MeetingResponseDTO } from "@/application/dtos/MeetingDTOs";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { WorkspaceEventTrackingService } from "@/application/services/WorkspaceEventTrackingService";
import { ICreateMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/ICreateMeetingUseCase";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
  constructor(
    private readonly meetingRepo: IMeetingRepository,
    private readonly eventTrackingService: WorkspaceEventTrackingService,
    private readonly uidGenerator: IUidGenerator
  ) {}

  async execute(dto: CreateMeetingDTO): Promise<MeetingResponseDTO> {
    const meetingId = this.uidGenerator.createId();
    
    // Add host to participants if not already present
    const participants = new Set(dto.participants);
    participants.add(dto.hostId);

    const meeting = await this.meetingRepo.create({
      meetingId,
      workspaceId: dto.workspaceId,
      hostId: dto.hostId,
      title: dto.title,
      participants: Array.from(participants),
      status: "PENDING",
      scheduledAt: dto.scheduledAt,
      duration: dto.duration,
      startedAt: null
    });

    // Create workspace activity log
    await this.eventTrackingService.trackEvent({
      workspaceId: dto.workspaceId,
      actorId: dto.hostId,
      eventType: "PROJECT_UPDATED", // Approximate since no MEETING_CREATED exists, keeping minimal changes
      entityType: "WORKSPACE",
      entityId: dto.workspaceId,
      metadata: {
        action: "MEETING_CREATED",
        meetingId: meeting.meetingId,
        title: meeting.title
      }
    });

    return meeting;
  }
}
