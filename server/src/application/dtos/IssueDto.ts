export interface CreateIssueDto {
  title: string;
  description: string;
  type: "STORY" | "TASK" | "BUG";
  priority: "LOW" | "MEDIUM" | "HIGH";
  sizeLabel?: "XS" | "S" | "M" | "L" | "XL";
  assigneeId?: string;
  sprintId?: string;
  projectId: string;
  workspaceId: string;
  acceptanceCriteria?: string[];
  attachments?: {
    name: string;
    url: string;
    type: "IMAGE" | "PDF" | "LINK";
  }[];
  parentId?: string | null;
  estimatedHours?: number;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  type?: "STORY" | "TASK" | "BUG";
  status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "TESTING" | "READY";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  sizeLabel?: "XS" | "S" | "M" | "L" | "XL" | null;
  assigneeId?: string | null;
  sprintId?: string | null;
  acceptanceCriteria?: string[];
  attachments?: {
    name: string;
    url: string;
    type: "IMAGE" | "PDF" | "LINK";
  }[];
  parentId?: string | null;
  taskIds?: string[];
  estimatedHours?: number;
  remainingHours?: number;
}
