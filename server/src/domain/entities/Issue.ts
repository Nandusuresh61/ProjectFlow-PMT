export type IssueType = "STORY" | "TASK" | "BUG";

export type IssueStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "TESTING" | "READY";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export type TshirtSize = "XS" | "S" | "M" | "L" | "XL"; // 1 | 2 | 3 | 5 | 8

export interface Attachment {
  name: string;
  url: string;
  type: "IMAGE" | "PDF" | "LINK";
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
    public taskIds: string[],
    public acceptanceCriteria: string[],
    public attachments: Attachment[],
    public estimatedHours: number | null,
    public remainingHours: number | null,
    public continuedFromIssueId: string | null = null,
    public continuedIssueId: string | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
