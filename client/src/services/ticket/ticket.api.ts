import { API } from "@/services/api";

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Ticket {
  ticketId: string;
  workspaceId: string;
  workspaceName?: string;
  createdBy: string;
  title: string;
  planType: string;
  priority: TicketPriority;
  status: TicketStatus;
  lastReplyAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketMessage {
  messageId: string;
  ticketId: string;
  senderId: string;
  senderName?: string;
  message: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetailsResponse {
  ticket: Ticket;
  messages: TicketMessage[];
}

export interface CreateTicketPayload {
  workspaceId: string;
  title: string;
  message: string;
  attachments?: string[];
}

export interface ReplyToTicketPayload {
  message: string;
  attachments?: string[];
}

export const createTicket = async (payload: CreateTicketPayload) => {
  const { data } = await API.post("/tickets", payload);
  return data;
};

export const getWorkspaceTickets = async (workspaceId: string, search?: string, page?: number, limit?: number) => {
  const { data } = await API.get("/tickets/my-workspace", {
    params: { workspaceId, search, page, limit }
  });
  return data;
};

export const getTicketDetails = async (ticketId: string) => {
  const { data } = await API.get(`/tickets/${ticketId}`);
  return data;
};

export const replyToTicket = async (ticketId: string, payload: ReplyToTicketPayload) => {
  const { data } = await API.post(`/tickets/${ticketId}/messages`, payload);
  return data;
};

// Admin APIs
export const getAllTickets = async (params: { status?: string; priority?: string; search?: string; page?: number; limit?: number }) => {
  const { data } = await API.get("/tickets/admin/all", { params });
  return data;
};

export const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
  const { data } = await API.patch(`/tickets/admin/${ticketId}/status`, { status });
  return data;
};

export const adminReplyToTicket = async (ticketId: string, payload: ReplyToTicketPayload) => {
  const { data } = await API.post(`/tickets/admin/${ticketId}/messages`, payload);
  return data;
};
