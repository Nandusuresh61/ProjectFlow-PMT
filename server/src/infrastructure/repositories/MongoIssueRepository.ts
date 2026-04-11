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
      parentId: issue.parentId,
      subtasks: issue.subtasks,
      attachments: issue.attachments,
    });

    return this.toDomain(created);
  }

  async findByProjectId(projectId: string, page: number, limit: number, search?: string): Promise<{ issues: Issue[], total: number }> {
    const query: any = { projectId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issueKey: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [issues, total] = await Promise.all([
      IssueModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      IssueModel.countDocuments(query)
    ]);

    return {
      issues: issues.map((doc: any) => this.toDomain(doc)),
      total
    };
  }

  async findById(issueId: string): Promise<Issue | null> {
    const doc = await IssueModel.findOne({ issueId }).lean();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async update(issueId: string, data: Partial<Issue>): Promise<Issue | null> {
    const updated = await IssueModel.findOneAndUpdate(
      { issueId },
      { $set: data },
      { new: true }
    ).lean();

    if (!updated) return null;
    return this.toDomain(updated);
  }

  async findBySprintId(sprintId: string): Promise<Issue[]> {
    const issues = await IssueModel.find({ sprintId }).lean();
    return issues.map((doc: any) => this.toDomain(doc));
  }

  async countActiveByAssigneeAndProject(assigneeId: string, projectId: string): Promise<number> {
    return IssueModel.countDocuments({
      assigneeId,
      projectId,
      status: { $ne: 'DONE' }
    });
  }

  async countByProjectIdAndStatus(projectId: string, statuses: string[]): Promise<number> {
    return IssueModel.countDocuments({
      projectId,
      status: { $in: statuses }
    });
  }

  async findRecentByProjectId(projectId: string, limit: number): Promise<Issue[]> {
    const issues = await IssueModel.find({ projectId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
    return issues.map((doc: any) => this.toDomain(doc));
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
      doc.parentId,
      doc.subtasks,
      doc.attachments || [],
      doc.createdAt,
      doc.updatedAt
    );
  }
}