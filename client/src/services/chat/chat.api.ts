import { API } from "@/services/api";

export interface Message {
  messageId: string;
  roomId: string;
  senderId: string;
  senderName?: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse<T = unknown> {
  success: boolean;
  data?: T;
}

export const getChatMessages = async (roomId: string, limit: number = 50, skip: number = 0): Promise<ChatResponse<Message[]>> => {
  const { data } = await API.get<ChatResponse<Message[]>>(`chat/messages/${roomId}`, {
    params: { limit, skip },
  });
  return data;
};
