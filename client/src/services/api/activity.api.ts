import { API } from "@/services/api";
import type { WorkspaceEvent } from "@/types/activity";

export interface ActivityResponse<T = WorkspaceEvent[]> {
  success: boolean;
  message: string;
  data?: T;
}

export const getWorkspaceActivityFeed = async (
  workspaceId: string,
  limit: number = 20,
  offset: number = 0
): Promise<ActivityResponse> => {
  const { data } = await API.get<ActivityResponse>(`/activity/workspace/${workspaceId}`, {
    params: { limit, offset },
  });
  return data;
};

export const getEntityTimeline = async (
  entityId: string,
  limit: number = 50,
  offset: number = 0
): Promise<ActivityResponse> => {
  const { data } = await API.get<ActivityResponse>(`/activity/entity/${entityId}`, {
    params: { limit, offset },
  });
  return data;
};
