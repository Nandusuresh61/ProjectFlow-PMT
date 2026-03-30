import { API_ROUTES } from "@/constants/api.constants";
import { API } from "@/services/api";

export interface ProjectData {
  projectId: string;
  projectKey: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdBy: string;
  memberIds: string[];
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateProjectPayload {
  workspaceId: string;
  projectKey: string;
  name: string;
  description?: string | null;
  memberIds?: string[];
}

export interface UpdateProjectPayload {
  projectKey?: string;
  name?: string;
  description?: string | null;
  memberIds?: string[];
}

export const getWorkspaceProjects = async (
  workspaceId: string
): Promise<ProjectResponse<ProjectData[]>> => {
  const { data } = await API.get<ProjectResponse<ProjectData[]>>(
    API_ROUTES.PROJECT.LIST_BY_WORKSPACE(workspaceId)
  );

  return data;
};

export const createProject = async (
  payload: CreateProjectPayload
): Promise<ProjectResponse<ProjectData>> => {
  const { data } = await API.post<ProjectResponse<ProjectData>>(
    API_ROUTES.PROJECT.BASE,
    payload
  );

  return data;
};

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload
): Promise<ProjectResponse<ProjectData>> => {
  const { data } = await API.patch<ProjectResponse<ProjectData>>(
    API_ROUTES.PROJECT.UPDATE(projectId),
    payload
  );

  return data;
};
