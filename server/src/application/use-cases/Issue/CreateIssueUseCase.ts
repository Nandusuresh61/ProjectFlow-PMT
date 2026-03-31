import { CreateIssueDto } from "@/application/dtos/IssueDto";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { Issue } from "@/domain/entities/Issue";
import { sizeToPointsMap } from "@/shared/story/sizeToPointsMap";

export class CreateIssueUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _uidGenerator: IUidGenerator,
  ) {}

  async execute(data: CreateIssueDto): Promise<Issue> {
    const project = await this._projectRepo.findById(data.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const sequence = await this._projectRepo.incrementIssueSequence(
      data.projectId,
    );

    const issueKey = `${project.projectKey}-${sequence}`;

    let storyPoints: number | null = null;

    if (data.sizeLabel) {
      storyPoints = sizeToPointsMap[data.sizeLabel];
    }

    const status = data.sprintId ? "TODO" : "BACKLOG";

    const issue = new Issue(
      this._uidGenerator.createId(),
      issueKey,
      data.title,
      data.description || "",
      data.type,
      status,
      data.priority,
      data.sizeLabel || null,
      storyPoints,
      data.assigneeId || null,
      data.sprintId || null,
      data.projectId,
      data.workspaceId,
      data.subtasks || [],
      new Date(),
      new Date(),
    );

    return await this._issueRepo.create(issue);
  }
}
