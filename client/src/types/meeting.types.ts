export interface Meeting {
  meetingId: string;
  workspaceId: string;
  hostId: string;
  title: string;
  participants: string[];
  status: "PENDING" | "ACTIVE" | "ENDED";
  scheduledAt: Date;
  duration: number;
  startedAt: Date | null;
  endedAt: Date | null;
}

export interface CreateMeetingPayload {
  workspaceId: string;
  title: string;
  participants: string[];
  scheduledAt: Date;
  duration: number;
}

export interface EditMeetingPayload {
  title: string;
  participants: string[];
  scheduledAt: Date;
  duration: number;
}
