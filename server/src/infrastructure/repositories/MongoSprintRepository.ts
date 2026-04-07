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
    return docs.map(
      (doc) =>
        new Sprint(
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
        ),
    );
  }
}