import { API } from "@/services/api";
import type { Meeting, CreateMeetingPayload, EditMeetingPayload } from "@/types/meeting.types";

export const createMeeting = async (payload: CreateMeetingPayload): Promise<Meeting> => {
  const response = await API.post("/meetings", payload);
  return response.data.data;
};

export const getMeeting = async (meetingId: string): Promise<Meeting> => {
  const response = await API.get(`/meetings/${meetingId}`);
  return response.data.data;
};

export const getWorkspaceMeetings = async (workspaceId: string): Promise<Meeting[]> => {
  const response = await API.get(`/meetings/workspace/${workspaceId}`);
  return response.data.data;
};

export const endMeeting = async (meetingId: string): Promise<Meeting> => {
  const response = await API.post(`/meetings/${meetingId}/end`);
  return response.data.data;
};

export const updateMeeting = async (meetingId: string, payload: EditMeetingPayload): Promise<Meeting> => {
  const response = await API.put(`/meetings/${meetingId}`, payload);
  return response.data.data;
};
