import { API_ROUTES } from "@/constants/api.constants";
import { API } from "@/services/api";

export interface CreateIssuePayload {
  title: string;
  description?: string;
  type: "STORY" | "TASK" | "BUG";
  priority: "LOW" | "MEDIUM" | "HIGH";
  sizeLabel?: "XS" | "S" | "M" | "L" | "XL" | null;
  assigneeId?: string | null;
  sprintId?: string | null;
  projectId: string;
  workspaceId?: string;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

export interface IssueResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const createIssue = async (
  payload: CreateIssuePayload
): Promise<IssueResponse> => {
  const { data } = await API.post<IssueResponse>(
    API_ROUTES.ISSUE.CREATE,
    payload
  );

  return data;
};
