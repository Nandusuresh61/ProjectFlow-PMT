import { Meeting } from "@/domain/entities/Meeting";

export interface IMeetingRepository {
  create(meeting: Partial<Meeting>): Promise<Meeting>;
  findById(meetingId: string): Promise<Meeting | null>;
  findByWorkspace(workspaceId: string): Promise<Meeting[]>;
  update(meetingId: string, data: Partial<Meeting>): Promise<Meeting | null>;
}
