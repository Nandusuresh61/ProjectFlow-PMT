import { useState, useEffect } from 'react';
import { Video, Plus, Calendar, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspace.store';
import { getWorkspaceMeetings } from '@/services/meetingService';
import { AuthUserState } from '@/store/auth.store';
import { toast } from 'sonner';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';
import { WorkspaceRoleEnum } from '@/shared/enums/WorkspaceRolesEnum';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'Upcoming', color: 'text-[#A5D7E8]', bg: 'bg-[#A5D7E8]/10' },
    ACTIVE: { label: '● Live', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ENDED: { label: 'Done', color: 'text-white/30', bg: 'bg-white/5' },
};

export const MeetingsView = () => {
    const navigate = useNavigate();
    const { currentWorkspace, currentWorkspaceRole } = useWorkspaceStore();
    const { user } = AuthUserState();
    
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const canCreateMeeting = currentWorkspaceRole === WorkspaceRoleEnum.WORKSPACE_ADMIN || currentWorkspaceRole === WorkspaceRoleEnum.WORKSPACE_OWNER;

    const fetchMeetings = async () => {
        if (!currentWorkspace?.workspaceId) return;
        setLoading(true);
        try {
            const data = await getWorkspaceMeetings(currentWorkspace.workspaceId);
            setMeetings(data || []);
        } catch (error) {
            toast.error("Failed to fetch meetings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, [currentWorkspace?.workspaceId]);

    return (
    <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Meetings</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-1">Schedule and join team meetings</p>
            </div>
            <div className="flex gap-2">
                {canCreateMeeting && (
                    <button 
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all"
                    >
                        <Plus size={15} />
                        Schedule Meeting
                    </button>
                )}
            </div>
        </div>

        {/* Today's Banner */}
        <div className="bg-[#A5D7E8]/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#A5D7E8]/10 flex items-center justify-center text-[#A5D7E8]">
                <Calendar size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-[#576CBC]/60 font-medium">You have {meetings.filter(m => m.status === 'PENDING').length} upcoming meetings</p>
            </div>
        </div>

        {/* Meeting list */}
        <div className="space-y-3">
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-indigo-500" size={24} />
                </div>
            ) : meetings.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <p>No meetings found in this workspace.</p>
                </div>
            ) : (
                meetings.map(meeting => {
                    const cfg = statusConfig[meeting.status] || statusConfig.PENDING;
                    const date = new Date(meeting.scheduledAt);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateString = date.toLocaleDateString();
                    
                    return (
                        <div
                            key={meeting.meetingId}
                            className="flex items-center gap-4 bg-white/[0.025] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-[#A5D7E8] transition-colors flex-shrink-0">
                                <Video size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-white truncate">{meeting.title}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                        {cfg.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white/30">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> {dateString}
                                    </span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} /> {timeString}
                                    </span>
                                    <span>·</span>
                                    <span>{meeting.duration}m</span>
                                </div>
                            </div>

                            {/* Avatars placeholder */}
                            <div className="flex items-center gap-2 mr-2 text-xs text-gray-400">
                                {meeting.participants.length} Participant{meeting.participants.length !== 1 ? 's' : ''}
                            </div>

                            {(meeting.status === 'PENDING' || meeting.status === 'ACTIVE') && (
                                <button 
                                    onClick={() => navigate(`/meetings/${meeting.meetingId}`)}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white transition-all shadow-sm flex-shrink-0"
                                >
                                    Join
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>

        <ScheduleMeetingModal 
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            onCreated={() => {
                fetchMeetings();
            }}
        />
    </div>
    );
};
