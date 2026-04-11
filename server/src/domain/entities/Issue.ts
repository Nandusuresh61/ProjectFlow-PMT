export type IssueType = "STORY" | "TASK" | "BUG";

export type IssueStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export type TshirtSize = "XS" | "S" | "M" | "L" | "XL"; // 1 | 2 | 3 | 5 | 8

export interface Attachment {
  name: string;
  url: string;
  type: "IMAGE" | "PDF" | "LINK";
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export class Issue {
  constructor(
    public readonly issueId: string,
    public readonly issueKey: string,
    public title: string,
    public description: string,
    public type: IssueType,
    public status: IssueStatus,
    public priority: IssuePriority,
    public sizeLabel: TshirtSize | null,
    public storyPoints: number | null, // 1 | 2 | 3 | 5 | 8
    public assigneeId: string | null,
    public sprintId: string | null,
    public readonly projectId: string,
    public readonly workspaceId: string,
    public readonly parentId: string | null,
    public subtasks: SubTask[],
    public attachments: Attachment[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
