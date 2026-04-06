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
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  parentId?: string | null;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  type?: "STORY" | "TASK" | "BUG";
  status?: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  sizeLabel?: "XS" | "S" | "M" | "L" | "XL" | null;
  assigneeId?: string | null;
  sprintId?: string | null;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  parentId?: string | null;
}
