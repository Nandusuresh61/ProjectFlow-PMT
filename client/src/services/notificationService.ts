import { API } from '@/services/api';
import type { INotification } from '@/types/notification.types';

export const notificationService = {
  getNotifications: async (page = 1, limit = 20, workspaceId?: string) => {
    let url = `/notifications?page=${page}&limit=${limit}`;
    if (workspaceId) url += `&workspaceId=${workspaceId}`;
    const response = await API.get<{ success: boolean; data: { notifications: INotification[]; totalUnread: number } }>(url);
    return response.data.data;
  },

  getUnreadCount: async (workspaceId?: string) => {
    let url = '/notifications/unread-count';
    if (workspaceId) url += `?workspaceId=${workspaceId}`;
    const response = await API.get<{ success: boolean; data: { count: number } }>(url);
    return response.data.data.count;
  },

  markAsRead: async (notificationId: string) => {
    const response = await API.patch<{ success: boolean; data: { notificationId: string; isRead: boolean } }>(`/notifications/${notificationId}/read`);
    return response.data.data;
  }
};
