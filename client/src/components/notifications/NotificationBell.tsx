import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, BellRing, MessageSquare, UserPlus, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType } from '@/types/notification.types';


const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.WORKSPACE_INVITE:
      return <UserPlus size={16} className="text-blue-400" />;
    case NotificationType.ISSUE_ASSIGNED:
      return <Info size={16} className="text-emerald-400" />;
    case NotificationType.ISSUE_COMMENT:
      return <MessageSquare size={16} className="text-yellow-400" />;
    case NotificationType.SPRINT_STARTED:
      return <Play size={16} className="text-purple-400" />;
    case NotificationType.TICKET_REPLY:
      return <MessageSquare size={16} className="text-indigo-400" />;
    default:
      return <Bell size={16} className="text-gray-400" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, clearHistory } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white"
      >
        {unreadCount > 0 ? (
          <BellRing size={18} className="animate-pulse text-blue-400" />
        ) : (
          <Bell size={18} />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white shadow-lg shadow-blue-500/50 ring-2 ring-[#060d1a]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-[#0a1120]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory();
                  }}
                  className="text-[11px] text-white/40 hover:text-red-400 transition-colors uppercase tracking-wider font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Bell size={24} className="text-white/20" />
                  </div>
                  <p className="text-sm font-medium text-white/60">No notifications yet</p>
                  <p className="text-xs text-white/40 mt-1">When you get notifications, they'll show up here</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      className={`group flex items-start gap-3 p-4 border-b border-white/5 transition-colors cursor-pointer
                        ${notification.isRead ? 'hover:bg-white/[0.02]' : 'bg-blue-500/[0.03] hover:bg-blue-500/[0.05]'}`}
                    >
                      <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${notification.isRead ? 'bg-white/5' : 'bg-blue-500/10'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={`text-sm font-medium truncate ${notification.isRead ? 'text-white/80' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] whitespace-nowrap text-white/40 mt-0.5">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className={`text-[13px] leading-snug line-clamp-2 ${notification.isRead ? 'text-white/50' : 'text-white/70'}`}>
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, notification.notificationId)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all shrink-0"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/5 bg-black/20 flex justify-center">
                <button className="text-[11px] font-medium text-white/50 hover:text-white/80 transition-colors uppercase tracking-wider">
                  View All Activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
