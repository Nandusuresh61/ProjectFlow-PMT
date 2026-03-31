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
}
