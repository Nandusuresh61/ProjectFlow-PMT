import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { Sprint } from "@/domain/entities/Sprint";
import { SprintModel } from "@/infrastructure/database/models/MongoSprintModel";

export class SprintRepository implements ISprintRepository {
  async create(sprint: Sprint): Promise<void> {
    await SprintModel.create({
      sprintId: sprint.sprintId,
      projectId: sprint.projectId,
      name: sprint.name,
      status: sprint.status,
      issueIds: sprint.issueIds,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      goal: sprint.goal,
      createdAt: sprint.createdAt,
      updatedAt: sprint.updatedAt,
    });
  }

  async findByProjectId(projectId: string): Promise<Sprint[]> {
    const docs = await SprintModel.find({ projectId }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(sprintId: string): Promise<Sprint | null> {
    const doc = await SprintModel.findOne({ sprintId }).lean();
    if (!doc) return null;
    return this.toDomain(doc as any);
  }

  async update(
    sprintId: string,
    data: Partial<Sprint>,
  ): Promise<Sprint | null> {
    const updated = await SprintModel.findOneAndUpdate(
      { sprintId },
      { $set: data },
      { new: true },
    ).lean();

    if (!updated) return null;
    return this.toDomain(updated as any);
  }

  async findActiveProjectId(projectId: string): Promise<Sprint | null> {
    const sprint = await SprintModel.findOne({ projectId, status: "ACTIVE" });

    return sprint ? this.toDomain(sprint) : null;
  }

  private toDomain(doc: any): Sprint {
    return new Sprint(
      doc.sprintId,
      doc.projectId,
      doc.name,
      doc.status,
      doc.issueIds,
      doc.createdAt,
      doc.updatedAt,
      doc.goal,
      doc.startDate,
      doc.endDate,
    );
  }
}
