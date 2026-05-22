export interface CreateMeetingDTO {
  workspaceId: string;
  hostId: string;
  title: string;
  participants: string[];
  scheduledAt: Date;
  duration: number;
}

export interface MeetingResponseDTO {
  meetingId: string;
  workspaceId: string;
  hostId: string;
  title: string;
  participants: string[];
  status: string;
  scheduledAt: Date;
  duration: number;
  startedAt: Date | null;
  endedAt: Date | null;
}
