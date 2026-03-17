import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

export const getMembers = async (workspaceId: string) => {
  const response = await API.get(API_ROUTES.WORKSPACE.MEMBERS(workspaceId));
  return response.data;
};
