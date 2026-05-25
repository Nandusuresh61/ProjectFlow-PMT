import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getWorkspaceActivityFeed } from "@/services/api/activity.api";
import type { WorkspaceEvent } from "@/types/activity";
import { formatActivityMessage } from "@/lib/formatActivityMessage";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, User, Activity, Folder, Hash } from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/app/Providers/SocketProvider";

export const ActivityView = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { socket, isConnected } = useSocket();
  const [activities, setActivities] = useState<WorkspaceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      loadActivities();
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (!socket || !isConnected || !currentWorkspace) return;

    socket.emit("join_workspace_activity", currentWorkspace.workspaceId);

    const handleNewActivity = (newEvent: WorkspaceEvent) => {
      setActivities((prev) => [newEvent, ...prev]);
    };

    socket.on("new_activity", handleNewActivity);

    return () => {
      socket.emit("leave_workspace_activity", currentWorkspace.workspaceId);
      socket.off("new_activity", handleNewActivity);
    };
  }, [socket, isConnected, currentWorkspace]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      if (currentWorkspace?.workspaceId) {
        const response = await getWorkspaceActivityFeed(currentWorkspace.workspaceId);
        setActivities(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to load activity feed");
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "USER": return <User className="w-3.5 h-3.5" />;
      case "PROJECT": return <Folder className="w-3.5 h-3.5" />;
      case "ISSUE": return <Hash className="w-3.5 h-3.5" />;
      default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  const getEntityColorClass = (entityType: string) => {
    switch (entityType) {
      case "USER": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PROJECT": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "ISSUE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const groupActivitiesByDate = () => {
    const grouped: Record<string, WorkspaceEvent[]> = {};
    activities.forEach(activity => {
      const date = new Date(activity.createdAt);
      let dateKey = format(date, "MMM dd, yyyy");
      if (isToday(date)) dateKey = "Today";
      else if (isYesterday(date)) dateKey = "Yesterday";

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <Activity className="absolute w-5 h-5 text-indigo-400 animate-pulse" />
        </div>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByDate();

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Workspace Activity
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time visual stream and historical event log of your workspace.
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-xs font-medium text-gray-400">{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-24 bg-gray-900/20 rounded-2xl border border-gray-800/60 backdrop-blur-sm">
          <Activity className="w-14 h-14 text-gray-700 mx-auto mb-5" />
          <h3 className="text-xl font-semibold text-gray-300">Quiet for now</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
            Activity logs and event streams will populate here automatically as your team performs tasks.
          </p>
        </div>
      ) : (
        <div className="relative pl-8 border-l border-gray-800/60 ml-4 space-y-12">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="relative group/day">
              {/* Day Marker Dot on the main line */}
              <div className="absolute -left-[40px] top-1.5 w-4 h-4 rounded-full bg-gray-950 border-4 border-indigo-500 ring-4 ring-indigo-950/30 z-10 transition-transform duration-300 group-hover/day:scale-125"></div>

              {/* Date Header */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase inline-flex items-center space-x-1.5 bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{date}</span>
                </h3>
              </div>

              {/* Activities list chained */}
              <div className="space-y-8">
                {dateActivities.map((activity, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={activity.eventId}
                    className="relative group/item"
                  >
                    {/* Visual Connector Node */}
                    <div 
                      className={`${getEntityColorClass(activity.entityType)} absolute -left-[48px] top-1 w-8 h-8 rounded-full flex items-center justify-center border bg-gray-950 z-10 shadow-md transition-all duration-300 group-hover/item:scale-110 group-hover/item:border-indigo-500/40`}
                    >
                      {getEntityIcon(activity.entityType)}
                      
                      {/* Dynamic vertical line between nodes inside the same day */}
                      {index < dateActivities.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-32px] w-[1px] bg-gradient-to-b from-gray-800 to-gray-800/10 -z-10"></div>
                      )}
                    </div>

                    {/* Log Body */}
                    <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800/40 hover:border-gray-700/60 hover:bg-gray-800/20 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm text-gray-300 leading-relaxed font-medium">
                            {formatActivityMessage(activity, activity.actorName || activity.actorId)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 shrink-0 select-none">
                          <span>{format(new Date(activity.createdAt), "h:mm a")}</span>
                          <span className="px-2 py-0.5 rounded bg-gray-900/60 border border-gray-800/80 font-mono tracking-tight text-[10px]">
                            {activity.entityType}
                          </span>
                        </div>
                      </div>
                      
                      {/* Subtle expand / detail tag when metadata is present */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-800/30 flex flex-wrap gap-2">
                          {Object.entries(activity.metadata).map(([key, value]) => {
                            if (typeof value !== "object" && value !== null && value !== undefined) {
                              return (
                                <div key={key} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-gray-950/40 border border-gray-800/40 text-[11px] text-gray-400">
                                  <span className="font-semibold text-gray-500">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityView;
