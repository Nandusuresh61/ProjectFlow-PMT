import type { InvitationPayload } from "@/types/invitation.type";
import { API } from "../api";
import { API_ROUTES } from "@/constants/api.constants";

export const InviteMember = async (
  workspaceId: string,
  payload: InvitationPayload,
) => {
  const response = await API.post(API_ROUTES.WORKSPACE.INVITE(workspaceId), payload);
  return response.data;
};

export const acceptInvitation = async (token: string) => {
  const response = await API.post(API_ROUTES.WORKSPACE.ACCEPT_INVITATION, { token });
  return response.data;
};
