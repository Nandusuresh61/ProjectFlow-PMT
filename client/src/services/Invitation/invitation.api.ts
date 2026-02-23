import type { InvitationPayload } from "@/types/invitation.type";
import { API } from "../api";

export const InviteMember = async (
  workspaceId: string,
  payload: InvitationPayload,
) => {
  const response = await API.post(`/workspace/${workspaceId}/invite`, payload);
  return response.data;
};
