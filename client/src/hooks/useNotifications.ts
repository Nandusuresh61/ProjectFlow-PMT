import { useState, useEffect, useCallback } from 'react';
import type { INotification } from '@/types/notification.types';
import { notificationService } from '@/services/notificationService';
import { useSocket } from '@/app/Providers/SocketProvider';
import { AuthUserState } from '@/store/auth.store';
import { useWorkspaceStore } from '@/store/workspace.store';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = AuthUserState((state) => state.user);
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const { socket } = useSocket();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(1, 20, currentWorkspace?.workspaceId);
      setNotifications(data.notifications);
      setUnreadCount(data.totalUnread);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, currentWorkspace?.workspaceId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    if (!socket) return;

    const handleNewNotification = (notification: INotification) => {
      if (currentWorkspace?.workspaceId && notification.workspaceId !== currentWorkspace.workspaceId) {
        return;
      }
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleNotificationRead = (notificationId: string) => {
      setNotifications(prev => prev.map(n => 
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
    };
  }, [user, socket, currentWorkspace?.workspaceId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (socket) {
        socket.emit('mark_notification_read', notificationId);
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    refresh: fetchNotifications
  };
};
