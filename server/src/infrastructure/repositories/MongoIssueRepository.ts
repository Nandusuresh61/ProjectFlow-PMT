import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { Issue } from "@/domain/entities/Issue";
import { IssueModel } from "../database/models/MongoIssueModel";

export class MongoIssueRepository implements IIssueRepository {
  
  async create(issue: Issue): Promise<Issue> {
    const created = await IssueModel.create({
      issueId: issue.issueId,
      issueKey: issue.issueKey,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      sizeLabel: issue.sizeLabel,
      storyPoints: issue.storyPoints,
      assigneeId: issue.assigneeId,
      sprintId: issue.sprintId,
      projectId: issue.projectId,
      workspaceId: issue.workspaceId,
      subtasks: issue.subtasks,
    });

    return this.toDomain(created);
  }

  private toDomain(doc: any): Issue {
    return new Issue(
      doc.issueId,
      doc.issueKey,
      doc.title,
      doc.description,
      doc.type,
      doc.status,
      doc.priority,
      doc.sizeLabel,
      doc.storyPoints,
      doc.assigneeId,
      doc.sprintId,
      doc.projectId,
      doc.workspaceId,
      doc.subtasks,
      doc.createdAt,
      doc.updatedAt
    );
  }
}