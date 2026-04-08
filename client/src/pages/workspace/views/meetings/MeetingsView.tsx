import { Video, Plus, Calendar, Clock } from 'lucide-react';

interface Meeting {
    id: string;
    title: string;
    project: string;
    time: string;
    duration: string;
    participants: string[];
    status: 'upcoming' | 'live' | 'done';
}

const MEETINGS: Meeting[] = [
    { id: '1', title: 'Sprint Planning', project: 'ProjectFlow PMT', time: 'Today, 3:00 PM', duration: '1h', participants: ['JD', 'SM', 'AK'], status: 'upcoming' },
    { id: '2', title: 'Design Review', project: 'Marketing Site', time: 'Today, 5:00 PM', duration: '30m', participants: ['LT', 'AK'], status: 'upcoming' },
    { id: '3', title: 'Daily Standup', project: 'ProjectFlow PMT', time: 'Yesterday, 9:00 AM', duration: '15m', participants: ['JD', 'SM', 'AK', 'LT'], status: 'done' },
];

const statusConfig = {
    upcoming: { label: 'Upcoming', color: 'text-[#A5D7E8]', bg: 'bg-[#A5D7E8]/10' },
    live: { label: '● Live', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    done: { label: 'Done', color: 'text-white/30', bg: 'bg-white/5' },
};

export const MeetingsView = () => (
    <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Meetings</h1>
                <p className="text-[#576CBC]/50 text-sm font-medium mt-1">Schedule and join team meetings</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#A5D7E8] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-white transition-all">
                <Plus size={15} />
                Schedule
            </button>
        </div>

        {/* Today's Banner */}
        <div className="bg-[#A5D7E8]/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#A5D7E8]/10 flex items-center justify-center text-[#A5D7E8]">
                <Calendar size={18} />
            </div>
            <div>
                <p className="text-sm font-semibold text-white">Monday, March 23</p>
                <p className="text-xs text-[#576CBC]/60 font-medium">You have 2 meetings scheduled today</p>
            </div>
        </div>

        {/* Meeting list */}
        <div className="space-y-3">
            {MEETINGS.map(meeting => {
                const cfg = statusConfig[meeting.status];
                return (
                    <div
                        key={meeting.id}
                        className="flex items-center gap-4 bg-white/[0.025] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-[#A5D7E8] transition-colors flex-shrink-0">
                            <Video size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white">{meeting.title}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                    {cfg.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/30">
                                <span>{meeting.project}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} /> {meeting.time}
                                </span>
                                <span>·</span>
                                <span>{meeting.duration}</span>
                            </div>
                        </div>

                        {/* Avatars */}
                        <div className="flex -space-x-1.5 flex-shrink-0">
                            {meeting.participants.slice(0, 3).map((p, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-full bg-[#19376D] border border-[#060d1a] flex items-center justify-center text-[8px] font-black text-[#A5D7E8]"
                                >
                                    {p}
                                </div>
                            ))}
                        </div>

                        {meeting.status !== 'done' && (
                            <button className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#A5D7E8]/10 text-sm font-semibold text-white/60 hover:text-[#A5D7E8] transition-all flex-shrink-0">
                                Join
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);
