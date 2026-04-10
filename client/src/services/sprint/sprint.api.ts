import { API_ROUTES } from "@/constants/api.constants";
import { API } from "@/services/api";

export interface SprintData {
  sprintId: string;
  projectId: string;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  issueIds: string[];
  startDate?: string;
  endDate?: string;
  goal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SprintResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateSprintPayload {
  projectId: string;
  name: string;
  goal?: string;
  workspaceId: string;
}

export const createSprint = async (
  payload: CreateSprintPayload
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.post<SprintResponse<SprintData>>(
    API_ROUTES.SPRINT.BASE,
    payload
  );

  return data;
};

export const getProjectSprints = async (
  projectId: string
): Promise<SprintResponse<SprintData[]>> => {
  const { data } = await API.get<SprintResponse<SprintData[]>>(
    API_ROUTES.SPRINT.LIST_BY_PROJECT(projectId)
  );

  return data;
};

export const assignIssueToSprint = async (
  issueId: string,
  sprintId: string | null
): Promise<SprintResponse<any>> => {
  const { data } = await API.patch<SprintResponse<any>>(
    API_ROUTES.SPRINT.ASSIGN_ISSUE,
    { issueId, sprintId }
  );

  return data;
};

export const startSprint = async (
  sprintId: string,
  startDate: string,
  endDate: string,
  workspaceId: string
): Promise<SprintResponse<SprintData>> => {
  const { data } = await API.patch<SprintResponse<SprintData>>(
    API_ROUTES.SPRINT.START,
    { sprintId, startDate, endDate, workspaceId }
  );

  return data;
};

