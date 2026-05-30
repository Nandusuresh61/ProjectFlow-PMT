import { IMeetingRepository } from "@/application/interfaces/repositories/IMeetingRepository";
import { Meeting } from "@/domain/entities/Meeting";
import { MeetingModel, MeetingDocument } from "@/infrastructure/database/models/MongoMeetingModel";
export class MeetingRepository implements IMeetingRepository {
  private mapToEntity(doc: MeetingDocument): Meeting {
    return new Meeting(
      doc.meetingId,
      doc.workspaceId,
      doc.hostId,
      doc.title,
      doc.participants,
      doc.status as "PENDING" | "ACTIVE" | "ENDED",
      doc.scheduledAt,
      doc.duration,
      doc.startedAt,
      doc.endedAt,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async create(meeting: Partial<Meeting>): Promise<Meeting> {
    const created = await MeetingModel.create(meeting);
    return this.mapToEntity(created);
  }

  async findById(meetingId: string): Promise<Meeting | null> {
    const meeting = await MeetingModel.findOne({ meetingId });
    if (!meeting) return null;
    return this.mapToEntity(meeting);
  }

  async findByWorkspace(workspaceId: string): Promise<Meeting[]> {
    const meetings = await MeetingModel.find({ workspaceId }).sort({ scheduledAt: -1 });
    return meetings.map(m => this.mapToEntity(m));
  }

  async update(meetingId: string, data: Partial<Meeting>): Promise<Meeting | null> {
    const updated = await MeetingModel.findOneAndUpdate(
      { meetingId },
      { $set: data },
      { returnDocument: "after" }
    );
    if (!updated) return null;
    return this.mapToEntity(updated);
  }
}
