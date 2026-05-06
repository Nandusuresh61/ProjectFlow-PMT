import { API_ROUTES } from "@/constants/api.constants";
import { API } from "@/services/api";

export interface WorkLogData {
  workLogId: string;
  issueId: string;
  userId: string;
  hours: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const getIssueWorkLogs = async (issueId: string): Promise<WorkLogResponse<WorkLogData[]>> => {
  const { data } = await API.get<WorkLogResponse<WorkLogData[]>>(API_ROUTES.WORKLOG.ISSUE(issueId));
  return data;
};

export const addWorkLog = async (
  issueId: string,
  payload: { hours: number; note?: string }
): Promise<WorkLogResponse<WorkLogData>> => {
  const { data } = await API.post<WorkLogResponse<WorkLogData>>(API_ROUTES.WORKLOG.ISSUE(issueId), payload);
  return data;
};

export const updateWorkLog = async (
  workLogId: string,
  payload: { hours?: number; note?: string }
): Promise<WorkLogResponse<WorkLogData>> => {
  const { data } = await API.patch<WorkLogResponse<WorkLogData>>(API_ROUTES.WORKLOG.LOG(workLogId), payload);
  return data;
};

export const deleteWorkLog = async (workLogId: string): Promise<WorkLogResponse> => {
  const { data } = await API.delete<WorkLogResponse>(API_ROUTES.WORKLOG.LOG(workLogId));
  return data;
};
