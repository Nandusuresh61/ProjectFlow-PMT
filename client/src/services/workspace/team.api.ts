import { API } from "../api";

export const getMembers = async (workspaceId: string) => {
  const response = await API.get(`/workspace/${workspaceId}/members`);
  return response.data;
};
